# Build script for Noor Al Maarifa Website
# PowerShell script for Windows deployment
Write-Host "🚀 Building Noor Al Maarifa Website..." -ForegroundColor Green

# Create public directory (Firebase hosting expects 'public')
if (Test-Path "public") {
    Remove-Item -Recurse -Force "public"
    Write-Host "🧹 Cleaned existing public folder" -ForegroundColor Yellow
}
New-Item -ItemType Directory -Path "public" | Out-Null
Write-Host "📁 Created public directory" -ForegroundColor Green

# Copy HTML files
Write-Host "📄 Copying HTML files..." -ForegroundColor Yellow
Copy-Item "index.html" "public/"

# Copy and minify CSS
Write-Host "🎨 Processing CSS..." -ForegroundColor Yellow
if (Get-Command npx -ErrorAction SilentlyContinue) {
    npx csso styles.css --output public/styles.min.css
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ CSS minified successfully" -ForegroundColor Green
    } else {
        Write-Host "⚠️  CSS minification failed, copying original" -ForegroundColor Yellow
        Copy-Item "styles.css" "public/"
    }
} else {
    Write-Host "⚠️  npx not found, copying original CSS" -ForegroundColor Yellow
    Copy-Item "styles.css" "public/"
}

# Copy JavaScript
Write-Host "📜 Copying JavaScript..." -ForegroundColor Yellow
Copy-Item "script.js" "public/"
Copy-Item "firebase-config.js" "public/"

# Copy images and assets
Write-Host "🖼️  Copying assets..." -ForegroundColor Yellow
# Copy all image files
$imageFiles = Get-ChildItem -Path "." -Include "*.png", "*.jpg", "*.jpeg", "*.svg", "*.ico", "*.gif" -File
foreach ($file in $imageFiles) {
    Copy-Item $file.FullName "public/"
    Write-Host "  ✓ Copied $($file.Name)" -ForegroundColor Gray
}

# Update HTML to use minified CSS if it exists
if (Test-Path "public/styles.min.css") {
    Write-Host "🔧 Updating HTML to use minified CSS..." -ForegroundColor Yellow
    $htmlContent = Get-Content "public/index.html" -Raw
    $htmlContent = $htmlContent -replace 'href="styles.css"', 'href="styles.min.css"'
    Set-Content "public/index.html" $htmlContent
}

# Validate build
Write-Host "🔍 Validating build..." -ForegroundColor Yellow
$requiredFiles = @("index.html", "script.js", "firebase-config.js")
foreach ($file in $requiredFiles) {
    if (Test-Path "public/$file") {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file missing!" -ForegroundColor Red
    }
}

Write-Host "✅ Build completed successfully!" -ForegroundColor Green
Write-Host "📁 Build files are in the 'public' directory" -ForegroundColor Cyan
Write-Host "🚀 Ready for Firebase deployment!" -ForegroundColor Green
