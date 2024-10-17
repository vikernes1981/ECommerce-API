import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './routers/userRouter.js';
import productRouter from './routers/productRouter.js';
import categoryRouter from './routers/categoryRouter.js';
import orderRouter from './routers/orderRouter.js';

const app = express();
const PORT = process.env.PORT || 5000; 

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use('/orders', orderRouter);

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start the server:', error);
    }
};

startServer();
