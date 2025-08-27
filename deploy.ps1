# Noor Al Maarifa Trading L.L.C - Deployment Script
# This script builds and deploys the website to Firebase

Write-Host "Building and deploying Noor Al Maarifa website..." -ForegroundColor Green

# Build the project
Write-Host "Building project..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
    
    # Deploy to Firebase
    Write-Host "Deploying to Firebase..." -ForegroundColor Yellow
    firebase deploy
    
    # Check if deployment was successful
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Deployment successful!" -ForegroundColor Green
        Write-Host "Website is now live at https://nooralmaarifa.web.app" -ForegroundColor Cyan
    } else {
        Write-Host "Deployment failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}