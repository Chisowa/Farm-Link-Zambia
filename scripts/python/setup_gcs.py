"""
Farm-Link Zambia — GCS Bucket Setup
Creates the 'famlinkdocs' bucket and its folder structure.
Run once after authenticating: gcloud auth application-default login
"""

import os
from google.cloud import storage
from dotenv import load_dotenv

load_dotenv()

PROJECT_ID = os.getenv("PROJECT_ID", "farmlink-zambia")
BUCKET_NAME = os.getenv("GCS_BUCKET", "famlinkdocs")
REGION = "us-central1"

FOLDERS = [
    "agricultural-docs/",
    "zari-bulletins/",
    "moa-publications/",
    "farmer-manuals/",
    "processed/",
]


def create_bucket(client: storage.Client) -> storage.Bucket:
    """Create the famlinkdocs bucket if it doesn't exist."""
    try:
        bucket = client.get_bucket(BUCKET_NAME)
        print(f"  Bucket gs://{BUCKET_NAME} already exists — skipping.")
        return bucket
    except Exception:
        pass

    bucket = client.bucket(BUCKET_NAME)
    bucket.storage_class = "STANDARD"
    new_bucket = client.create_bucket(bucket, location=REGION, project=PROJECT_ID)
    new_bucket.iam_configuration.uniform_bucket_level_access_enabled = True
    new_bucket.patch()
    print(f"  Created bucket gs://{BUCKET_NAME} in {REGION}")
    return new_bucket


def create_folders(bucket: storage.Bucket) -> None:
    """Create placeholder objects to simulate folder structure."""
    for folder in FOLDERS:
        blob = bucket.blob(f"{folder}.keep")
        if not blob.exists():
            blob.upload_from_string(b"", content_type="text/plain")
            print(f"  Created folder: gs://{BUCKET_NAME}/{folder}")
        else:
            print(f"  Folder exists: gs://{BUCKET_NAME}/{folder}")


def main() -> None:
    print(f"\n=== Farm-Link Zambia GCS Setup ===")
    print(f"Project : {PROJECT_ID}")
    print(f"Bucket  : {BUCKET_NAME}\n")

    client = storage.Client(project=PROJECT_ID)

    print("[1/2] Creating bucket...")
    bucket = create_bucket(client)

    print("[2/2] Creating folder structure...")
    create_folders(bucket)

    print(f"\n=== Done ===")
    print(f"Bucket URL: https://console.cloud.google.com/storage/browser/{BUCKET_NAME}")
    print(f"\nUpload documents:")
    print(f"  gsutil cp *.pdf gs://{BUCKET_NAME}/agricultural-docs/")
    print(f"\nThen run ingestion:")
    print(f"  python process_documents.py")


if __name__ == "__main__":
    main()
