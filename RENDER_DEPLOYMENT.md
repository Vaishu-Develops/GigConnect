# GigConnect Render Deployment Guide

## Quick Deploy to Render

### 1. **Connect Repository**
- Go to [render.com](https://render.com)
- Click "New +" → "Web Service"
- Connect your GitHub repository: `Vaishu-Develops/GigConnect`

### 2. **Configure Service**
```
Name: gigconnect
Environment: Node
Region: Any (choose closest to your users)
Branch: main
Build Command: cd frontend/gigconnect-frontend && npm ci && npm run build && cd ../../backend && npm ci
Start Command: cd backend && npm start
```

### 3. **Environment Variables**
Add these in Render dashboard:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLIENT_URL=https://gigconnect.onrender.com
CORS_ORIGIN=https://gigconnect.onrender.com
```

### 4. **Deploy**
- Click "Create Web Service"
- Wait for deployment (5-10 minutes)
- Your app will be live at: `https://gigconnect.onrender.com`

## Features on Render
✅ **Full-stack deployment** - Frontend + Backend + Database  
✅ **Real-time features** - Socket.io works perfectly  
✅ **Automatic HTTPS** - SSL certificate included  
✅ **Auto-deploys** - Updates when you push to GitHub  
✅ **Free tier available** - Great for testing  

## Database Options
1. **Render PostgreSQL** (recommended for production)
2. **MongoDB Atlas** (current setup)
3. **External database** of your choice

Your app will serve the React frontend and handle API requests on the same domain!