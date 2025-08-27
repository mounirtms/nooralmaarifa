# Noor Al Maarifa Trading L.L.C - Build Script
# This script builds the website for production

Write-Host "Building Noor Al Maarifa website for production..." -ForegroundColor Green

# Clean dist folder
Write-Host "Cleaning dist folder..." -ForegroundColor Yellow
npm run clean

# Build the project
Write-Host "Building project..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
    Write-Host "Production files are located in the dist folder" -ForegroundColor Cyan
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}