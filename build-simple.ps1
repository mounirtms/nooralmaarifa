# Build script for Noor Al Maarifa Website
Write-Host "Building Noor Al Maarifa Website..." -ForegroundColor Green

# Create public directory
if (Test-Path "public") {
    Remove-Item -Recurse -Force "public"
    Write-Host "Cleaned existing public folder" -ForegroundColor Yellow
}
New-Item -ItemType Directory -Path "public" | Out-Null
Write-Host "Created public directory" -ForegroundColor Green

# Copy HTML files
Write-Host "Copying HTML files..." -ForegroundColor Yellow
Copy-Item "index.html" "public/"

# Copy CSS
Write-Host "Processing CSS..." -ForegroundColor Yellow
Copy-Item "styles.css" "public/"

# Copy JavaScript
Write-Host "Copying JavaScript..." -ForegroundColor Yellow
Copy-Item "script.js" "public/"
if (Test-Path "firebase-config.js") {
    Copy-Item "firebase-config.js" "public/"
}

# Copy images and assets
Write-Host "Copying all images and assets..." -ForegroundColor Yellow
$assetFiles = Get-ChildItem -Path "." -Include "*.png", "*.jpg", "*.jpeg", "*.svg", "*.ico", "*.gif", "*.pdf", "*.webp", "*.mp4", "*.webm" -File
foreach ($file in $assetFiles) {
    Copy-Item $file.FullName "public/"
    Write-Host "  Copied $($file.Name) with size $($file.Length) bytes" -ForegroundColor Gray
}

# Validate build
Write-Host "Validating build..." -ForegroundColor Yellow
$requiredFiles = @("index.html", "script.js", "styles.css")
foreach ($file in $requiredFiles) {
    if (Test-Path "public/$file") {
        Write-Host "  OK: $file" -ForegroundColor Green
    } else {
        Write-Host "  MISSING: $file" -ForegroundColor Red
    }
}

Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host "Build files are in the 'public' directory" -ForegroundColor Cyan
