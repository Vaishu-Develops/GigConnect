# GigConnect Vercel Deployment Script for Windows

Write-Host "🚀 Deploying GigConnect to Vercel..." -ForegroundColor Green

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Build the frontend
Write-Host "📦 Building frontend..." -ForegroundColor Yellow
Set-Location "frontend\gigconnect-frontend"
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    exit 1
}

# Go back to root
Set-Location "..\..\"

# Deploy to Vercel
Write-Host "🌐 Deploying to Vercel..." -ForegroundColor Blue
vercel --prod

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Set environment variables in Vercel dashboard" -ForegroundColor White
Write-Host "2. Update VITE_API_URL with your Vercel domain" -ForegroundColor White
Write-Host "3. Test the deployment" -ForegroundColor White
Write-Host ""
Write-Host "📚 See VERCEL_DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan