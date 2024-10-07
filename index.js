// index.js

require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRouter = require('./routers/userRouter');
const productRouter = require('./routers/productRouter');
const categoryRouter = require('./routers/categoryRouter');
const orderRouter = require('./routers/orderRouter');
const sequelize = require('./db');

const app = express();
const PORT = process.env.PORT || 3000; 

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use('/orders', orderRouter);

// Sync database and start server
const startServer = async () => {
    try {
        await sequelize.sync();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start the server:', error);
    }
};

startServer();
