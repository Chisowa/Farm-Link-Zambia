#!/usr/bin/env bash
# ============================================================
# Farm-Link Zambia — Google Cloud Storage Setup (Linux/Mac)
# Run this once after: gcloud auth login && gcloud auth application-default login
# ============================================================
set -euo pipefail

PROJECT_ID="farmlink-zambia"
BUCKET_NAME="famlinkdocs"
REGION="us-central1"

echo ""
echo "=== Farm-Link Zambia GCS Setup ==="
echo "Project : $PROJECT_ID"
echo "Bucket  : $BUCKET_NAME"
echo "Region  : $REGION"
echo ""

# Set active project
echo "[1/5] Setting active GCP project..."
gcloud config set project "$PROJECT_ID"

# Enable required APIs
echo "[2/5] Enabling required APIs..."
gcloud services enable \
  storage.googleapis.com \
  firestore.googleapis.com \
  aiplatform.googleapis.com \
  cloudfunctions.googleapis.com \
  firebase.googleapis.com \
  iam.googleapis.com

# Create GCS bucket
echo "[3/5] Creating bucket: gs://$BUCKET_NAME ..."
if gsutil ls "gs://$BUCKET_NAME" &>/dev/null; then
  echo "  Bucket already exists — skipping creation."
else
  gsutil mb -p "$PROJECT_ID" -c STANDARD -l "$REGION" "gs://$BUCKET_NAME"
  echo "  Bucket created successfully."
fi

# Uniform bucket-level access
echo "[4/5] Enabling uniform bucket-level access..."
gsutil uniformbucketlevelaccess set on "gs://$BUCKET_NAME"

# Create folder structure
echo "[5/5] Creating folder structure..."
for folder in agricultural-docs zari-bulletins moa-publications farmer-manuals processed; do
  echo "" | gsutil cp - "gs://$BUCKET_NAME/$folder/.keep"
done

echo ""
echo "=== GCS Setup Complete ==="
echo "Bucket URL: https://console.cloud.google.com/storage/browser/$BUCKET_NAME"
echo ""
echo "Upload your PDFs:"
echo "  gsutil cp *.pdf gs://$BUCKET_NAME/agricultural-docs/"
echo ""
echo "Then run the Python ingestion pipeline:"
echo "  cd scripts/python && python process_documents.py"
