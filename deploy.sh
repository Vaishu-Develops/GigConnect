#!/bin/bash

echo "🚀 Deploying GigConnect to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the frontend
echo "📦 Building frontend..."
cd frontend/gigconnect-frontend
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

# Go back to root
cd ../..

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Set environment variables in Vercel dashboard"
echo "2. Update VITE_API_URL with your Vercel domain"
echo "3. Test the deployment"
echo ""
echo "📚 See VERCEL_DEPLOYMENT.md for detailed instructions"