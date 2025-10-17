import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import gigRoutes from './routes/gigRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'GigConnect API is running!' });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;