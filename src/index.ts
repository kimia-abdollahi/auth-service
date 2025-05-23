import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { connectRabbitMQ } from './utils/rabbit';

dotenv.config();

const app = express();
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;

connectDB().then(async () => {
    await connectRabbitMQ();
  
    app.listen(PORT, () => {
      console.log(`Auth service is running on port ${PORT}`);
    });
  });
