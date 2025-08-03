# Preview script for Noor Al Maarifa Website
Write-Host "🌐 Starting preview server for Noor Al Maarifa Website..." -ForegroundColor Green

# Check if http-server is available
if (Get-Command npx -ErrorAction SilentlyContinue) {
    Write-Host "🚀 Starting local server on http://localhost:3000" -ForegroundColor Cyan
    Write-Host "📱 Your website will open automatically in your default browser" -ForegroundColor Yellow
    Write-Host "⌨️  Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host "" -ForegroundColor White
    
    # Start the server
    npx http-server . -p 3000 -o
} else {
    Write-Host "❌ npx not found. Please install Node.js first." -ForegroundColor Red
    Write-Host "📥 Download Node.js from: https://nodejs.org/" -ForegroundColor Cyan
    Write-Host "🔄 After installation, run this script again." -ForegroundColor Yellow
}
