# GigConnect Vercel Deployment Guide

## Prerequisites
1. Vercel account
2. MongoDB Atlas database (or other cloud MongoDB)
3. Razorpay account credentials

## Deployment Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Set Environment Variables
In your Vercel dashboard, go to Settings > Environment Variables and add:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NODE_ENV=production
CORS_ORIGIN=https://your-vercel-domain.vercel.app
```

### 4. Deploy
From the project root directory:
```bash
vercel --prod
```

### 5. Update Frontend Environment
After deployment, update your frontend environment variable:
```
VITE_API_URL=https://your-vercel-domain.vercel.app/api
```

## Project Structure for Vercel
```
GigConnect/
├── vercel.json                    # Vercel configuration
├── backend/
│   ├── api/
│   │   └── index.js              # Serverless entry point
│   ├── app.js                    # Express app
│   └── ...                       # Other backend files
└── frontend/
    └── gigconnect-frontend/
        ├── package.json          # Frontend build config
        └── dist/                 # Built frontend (generated)
```

## Important Notes
- Socket.io real-time features may have limitations in serverless environment
- Consider using WebSockets alternatives for production (like Pusher)
- Database connections are handled per request in serverless
- File uploads should use cloud storage (AWS S3, Cloudinary, etc.)

## Troubleshooting
1. Check Vercel function logs in dashboard
2. Ensure all environment variables are set
3. Verify MongoDB connection string
4. Check CORS configuration for your domain