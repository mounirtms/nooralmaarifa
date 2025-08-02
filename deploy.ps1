# Deploy script for Noor Al Maarifa Website
Write-Host "🚀 Deploying Noor Al Maarifa Website to Firebase..." -ForegroundColor Green

# Check if Firebase CLI is available
if (Get-Command firebase -ErrorAction SilentlyContinue) {
    Write-Host "🔥 Firebase CLI found" -ForegroundColor Green
    
    # Run build first
    Write-Host "🏗️  Building the website..." -ForegroundColor Yellow
    .\build.ps1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build completed successfully" -ForegroundColor Green
        
        # Deploy to Firebase
        Write-Host "🌐 Deploying to Firebase Hosting..." -ForegroundColor Cyan
        firebase deploy
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "🎉 Deployment successful!" -ForegroundColor Green
            Write-Host "🌍 Your website is now live!" -ForegroundColor Cyan
        } else {
            Write-Host "❌ Deployment failed!" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Build failed! Cannot deploy." -ForegroundColor Red
    }
} else {
    Write-Host "❌ Firebase CLI not found. Please install it first." -ForegroundColor Red
    Write-Host "📥 Install Firebase CLI: npm install -g firebase-tools" -ForegroundColor Cyan
    Write-Host "🔑 Then login: firebase login" -ForegroundColor Cyan
    Write-Host "⚙️  Initialize project: firebase init" -ForegroundColor Cyan
}
