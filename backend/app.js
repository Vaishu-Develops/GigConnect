import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import gigRoutes from './routes/gigRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; // Add this
import paymentRoutes from './routes/paymentRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const app = express();


app.use('/api/webhooks', webhookRoutes);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);    
app.use('/api/gigs', gigRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes); // Add this
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);


// Home route
app.get('/', (req, res) => {
  res.json({ message: 'GigConnect API is running!' });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;