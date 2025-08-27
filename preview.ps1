# Noor Al Maarifa Trading L.L.C - Preview Script
# This script builds and serves the website locally for preview

Write-Host "Building and previewing Noor Al Maarifa website..." -ForegroundColor Green

# Build the project
Write-Host "Building project..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
    
    # Serve the website
    Write-Host "Starting local server..." -ForegroundColor Yellow
    Write-Host "Website will be available at http://localhost:3000" -ForegroundColor Cyan
    npm run serve
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}