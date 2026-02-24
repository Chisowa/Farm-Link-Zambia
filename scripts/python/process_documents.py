"""
Farm-Link Zambia — RAG Document Ingestion Pipeline
====================================================
Processes agricultural PDFs from GCS bucket 'famlinkdocs',
generates vector embeddings via Vertex AI, and stores them
in Firestore (knowledge_base collection) for RAG retrieval.

Usage:
    python process_documents.py [--folder agricultural-docs] [--doc-name my-doc]

Prerequisites:
    gcloud auth application-default login
    pip install -r requirements.txt
"""

import argparse
import io
import os
import sys
from datetime import datetime, timezone
from typing import Any

import numpy as np
import pdfplumber
from dotenv import load_dotenv
import vertexai
from google.cloud import firestore, storage
from vertexai.language_models import TextEmbeddingInput, TextEmbeddingModel

load_dotenv()

# ── Configuration ─────────────────────────────────────────────────────────────
PROJECT_ID = os.getenv("PROJECT_ID", "farmlink-zambia")
GCS_BUCKET = os.getenv("GCS_BUCKET", "famlinkdocs")
REGION = "us-central1"

EMBEDDING_MODEL = "text-embedding-004"
EMBEDDING_DIMENSION = 768   # cost-optimised (vs 1536)
BATCH_SIZE = 20             # max chunks per Vertex AI call
MAX_TOKENS_PER_CHUNK = 500
OVERLAP_TOKENS = 50

FIRESTORE_COLLECTION = "knowledge_base"

# ── GCP clients ───────────────────────────────────────────────────────────────
storage_client = storage.Client(project=PROJECT_ID)
firestore_client = firestore.Client(project=PROJECT_ID)
vertexai.init(project=PROJECT_ID, location=REGION)


# ── Text extraction ───────────────────────────────────────────────────────────

def extract_text_from_pdf(pdf_bytes: bytes) -> list[dict[str, Any]]:
    """Extract text from each page of a PDF.

    Returns a list of dicts with keys: text, page, metadata.
    """
    pages: list[dict[str, Any]] = []
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        total = len(pdf.pages)
        for page_num, page in enumerate(pdf.pages, start=1):
            text = page.extract_text()
            if text and text.strip():
                pages.append(
                    {
                        "text": text.strip(),
                        "page": page_num,
                        "metadata": {
                            "page_number": page_num,
                            "total_pages": total,
                        },
                    }
                )
    return pages


# ── Chunking ──────────────────────────────────────────────────────────────────

def chunk_text(
    pages: list[dict[str, Any]],
    max_tokens: int = MAX_TOKENS_PER_CHUNK,
    overlap: int = OVERLAP_TOKENS,
) -> list[dict[str, Any]]:
    """Split page text into overlapping chunks by word count (token proxy)."""
    chunks: list[dict[str, Any]] = []

    for page in pages:
        sentences = page["text"].split(". ")
        current_chunk = ""
        current_tokens = 0

        for sentence in sentences:
            s_tokens = len(sentence.split())

            if current_tokens + s_tokens > max_tokens and current_chunk:
                chunks.append(
                    {
                        "text": current_chunk.strip(),
                        "page": page["page"],
                        "tokens": current_tokens,
                        "metadata": page["metadata"],
                    }
                )
                # Start next chunk with overlap from previous sentences
                overlap_sentences = ". ".join(current_chunk.split(". ")[-2:])
                current_chunk = overlap_sentences + ". " + sentence
                current_tokens = len(current_chunk.split())
            else:
                current_chunk = (current_chunk + ". " + sentence) if current_chunk else sentence
                current_tokens += s_tokens

        if current_chunk.strip():
            chunks.append(
                {
                    "text": current_chunk.strip(),
                    "page": page["page"],
                    "tokens": current_tokens,
                    "metadata": page["metadata"],
                }
            )

    return chunks


# ── Embeddings ────────────────────────────────────────────────────────────────

def generate_embeddings(
    texts: list[str],
    task_type: str = "RETRIEVAL_DOCUMENT",
) -> list[list[float]]:
    """Generate Vertex AI text embeddings in a single batched call."""
    model = TextEmbeddingModel.from_pretrained(EMBEDDING_MODEL)
    inputs = [TextEmbeddingInput(text=text, task_type=task_type) for text in texts]
    results = model.get_embeddings(inputs, output_dimensionality=EMBEDDING_DIMENSION)
    return [list(r.values) for r in results]


# ── Firestore storage ─────────────────────────────────────────────────────────

def store_document(
    doc_name: str,
    source_folder: str,
    filename: str,
    topic_area: str,
    chunks: list[dict[str, Any]],
    embeddings: list[list[float]],
) -> None:
    """Write metadata + chunk embeddings to Firestore."""
    now = datetime.now(timezone.utc)

    # Parent document
    doc_ref = firestore_client.collection(FIRESTORE_COLLECTION).document(doc_name)
    doc_ref.set(
        {
            "name": doc_name,
            "filename": filename,
            "sourceFolder": source_folder,
            "topicArea": topic_area,
            "totalChunks": len(chunks),
            "createdAt": now,
            "updatedAt": now,
            "status": "processed",
        }
    )

    # Chunks subcollection (batched writes — Firestore limit: 500/batch)
    chunks_ref = doc_ref.collection("chunks")
    batch = firestore_client.batch()
    count = 0

    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        chunk_doc = chunks_ref.document(f"chunk_{i:04d}")
        batch.set(
            chunk_doc,
            {
                "text": chunk["text"],
                "page": chunk["page"],
                "chunkIndex": i,
                "tokens": chunk["tokens"],
                "embedding": embedding,
                "metadata": chunk["metadata"],
                "createdAt": now,
            },
        )
        count += 1

        if count >= 500:
            batch.commit()
            batch = firestore_client.batch()
            count = 0
            print(f"    Committed 500-chunk batch...")

    if count:
        batch.commit()
        print(f"    Committed final {count} chunks.")


# ── Main pipeline ─────────────────────────────────────────────────────────────

def process_document(
    gcs_path: str,
    doc_name: str,
    topic_area: str = "general",
) -> None:
    """Full pipeline: download → extract → chunk → embed → store."""
    filename = gcs_path.split("/")[-1]
    source_folder = "/".join(gcs_path.split("/")[:-1])

    print(f"\n[→] Processing '{doc_name}' from gs://{GCS_BUCKET}/{gcs_path}")

    # Download
    bucket = storage_client.bucket(GCS_BUCKET)
    blob = bucket.blob(gcs_path)
    pdf_bytes = blob.download_as_bytes()
    print(f"    Downloaded {len(pdf_bytes):,} bytes")

    # Extract
    pages = extract_text_from_pdf(pdf_bytes)
    print(f"    Extracted {len(pages)} pages with text")

    # Chunk
    chunks = chunk_text(pages)
    print(f"    Created {len(chunks)} chunks")

    # Embed (batched)
    print(f"    Generating embeddings (batch size={BATCH_SIZE})...")
    all_embeddings: list[list[float]] = []
    total_batches = (len(chunks) + BATCH_SIZE - 1) // BATCH_SIZE

    for i in range(0, len(chunks), BATCH_SIZE):
        batch_texts = [c["text"] for c in chunks[i : i + BATCH_SIZE]]
        batch_num = i // BATCH_SIZE + 1
        print(f"    Batch {batch_num}/{total_batches}")
        embs = generate_embeddings(batch_texts)
        all_embeddings.extend(embs)

    # Store
    print(f"    Storing in Firestore collection '{FIRESTORE_COLLECTION}'...")
    store_document(doc_name, source_folder, filename, topic_area, chunks, all_embeddings)

    print(f"[✓] Done: {doc_name}")


def list_pdfs_in_folder(folder: str) -> list[str]:
    """Return all PDF blob paths under a GCS folder."""
    bucket = storage_client.bucket(GCS_BUCKET)
    blobs = bucket.list_blobs(prefix=folder)
    return [b.name for b in blobs if b.name.lower().endswith(".pdf")]


# ── CLI ───────────────────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Farm-Link Zambia RAG ingestion pipeline")
    p.add_argument(
        "--folder",
        default="agricultural-docs",
        help="GCS folder to process (default: agricultural-docs)",
    )
    p.add_argument(
        "--doc-name",
        default=None,
        help="Process a single document by GCS path (e.g. agricultural-docs/maize.pdf)",
    )
    p.add_argument(
        "--topic",
        default="general",
        help="Topic area tag for the document (maize, wheat, pest, disease, etc.)",
    )
    return p.parse_args()


if __name__ == "__main__":
    args = parse_args()

    if args.doc_name:
        # Single document
        name = args.doc_name.split("/")[-1].replace(".pdf", "").replace(" ", "_").lower()
        process_document(args.doc_name, name, args.topic)
    else:
        # All PDFs in folder
        pdfs = list_pdfs_in_folder(args.folder)
        if not pdfs:
            print(f"No PDFs found in gs://{GCS_BUCKET}/{args.folder}/")
            sys.exit(0)

        print(f"Found {len(pdfs)} PDF(s) in gs://{GCS_BUCKET}/{args.folder}/")
        errors: list[str] = []

        for gcs_path in pdfs:
            doc_name = gcs_path.split("/")[-1].replace(".pdf", "").replace(" ", "_").lower()
            try:
                process_document(gcs_path, doc_name, args.topic)
            except Exception as e:
                print(f"[✗] Error processing {doc_name}: {e}")
                errors.append(doc_name)

        print(f"\n=== Ingestion complete ===")
        print(f"  Processed : {len(pdfs) - len(errors)}/{len(pdfs)}")
        if errors:
            print(f"  Failed    : {', '.join(errors)}")
