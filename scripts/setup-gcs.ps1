# ============================================================
# Farm-Link Zambia — Google Cloud Storage Setup (Windows)
# Run this once after: gcloud auth login && gcloud auth application-default login
# ============================================================

$PROJECT_ID = "farmlink-zambia"
$BUCKET_NAME = "famlinkdocs"
$REGION = "us-central1"

Write-Host "`n=== Farm-Link Zambia GCS Setup ===" -ForegroundColor Cyan
Write-Host "Project : $PROJECT_ID"
Write-Host "Bucket  : $BUCKET_NAME"
Write-Host "Region  : $REGION`n"

# Set the active project
Write-Host "[1/5] Setting active GCP project..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

# Enable required APIs
Write-Host "[2/5] Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable storage.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable aiplatform.googleapis.com
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable firebase.googleapis.com
gcloud services enable iam.googleapis.com

# Create the GCS bucket
Write-Host "[3/5] Creating bucket: gs://$BUCKET_NAME ..." -ForegroundColor Yellow
$bucketExists = gsutil ls gs://$BUCKET_NAME 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Bucket already exists — skipping creation." -ForegroundColor Green
} else {
    gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION "gs://$BUCKET_NAME"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Bucket created successfully." -ForegroundColor Green
    } else {
        Write-Host "  ERROR: Could not create bucket." -ForegroundColor Red
        exit 1
    }
}

# Enable uniform bucket-level access (recommended)
Write-Host "[4/5] Enabling uniform bucket-level access..." -ForegroundColor Yellow
gsutil uniformbucketlevelaccess set on "gs://$BUCKET_NAME"

# Create folder structure inside the bucket
Write-Host "[5/5] Creating folder structure in bucket..." -ForegroundColor Yellow
# gsutil doesn't create real folders — we use placeholder objects
$tmpFile = [System.IO.Path]::GetTempFileName()

"" | Out-File -FilePath $tmpFile -Encoding utf8
gsutil cp $tmpFile "gs://$BUCKET_NAME/agricultural-docs/.keep"
gsutil cp $tmpFile "gs://$BUCKET_NAME/zari-bulletins/.keep"
gsutil cp $tmpFile "gs://$BUCKET_NAME/moa-publications/.keep"
gsutil cp $tmpFile "gs://$BUCKET_NAME/farmer-manuals/.keep"
gsutil cp $tmpFile "gs://$BUCKET_NAME/processed/.keep"

Remove-Item $tmpFile -Force

Write-Host "`n=== GCS Setup Complete ===" -ForegroundColor Cyan
Write-Host "Bucket URL : https://console.cloud.google.com/storage/browser/$BUCKET_NAME"
Write-Host ""
Write-Host "Next step: Upload your agricultural PDFs with:"
Write-Host "  gsutil cp *.pdf gs://$BUCKET_NAME/agricultural-docs/"
Write-Host ""
Write-Host "Then run the Python ingestion pipeline:"
Write-Host "  cd scripts/python"
Write-Host "  python process_documents.py"
