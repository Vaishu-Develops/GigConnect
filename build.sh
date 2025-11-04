#!/bin/bash

echo "🚀 Building GigConnect for Render..."

# Build frontend
echo "📦 Building frontend..."
cd frontend/gigconnect-frontend
npm ci
npm run build

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd ../../backend
npm ci

echo "✅ Build complete for Render deployment!"