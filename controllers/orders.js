import Order from '../models/Order.js';
import { orderSchema, orderUpdateSchema } from '../schemas/orderSchemas.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// Get all orders
export const getOrders = async (req, res) => {
    console.log('Received GET request for orders');
    try {
        const orders = await Order.find().populate({ path: 'user', strictPopulate: false }).populate({ path: 'products.product', strictPopulate: false });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error); // Log the error for better visibility
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
};

// Create an order
export const createOrder = async (req, res) => {
    try {
        const { error } = orderSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const user = await User.findById(req.body.userId);
        if (!user) return res.status(400).json({ error: 'User does not exist' });

        // Find the products in the order request
        const products = await Product.find({
            _id: { $in: req.body.products.map(p => p.productId) }
        });
        if (products.length !== req.body.products.length) {
            return res.status(400).json({ error: 'Some products do not exist' });
        }

        // Calculate the total price of the order
        const total = req.body.products.reduce((acc, product) => {
            const productInfo = products.find(p => p._id.toString() === product.productId);
            return acc + product.quantity * productInfo.price;
        }, 0);

        // Create the order
        const order = new Order({
            user: req.body.userId,
            products: req.body.products,
            total
        });
        await order.save();

        // Return the created order
        const createdOrder = await Order.findById(order._id).populate('user').populate('products.product');
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
};

// Get a specific order by ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user').populate('products.product');
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve order' });
    }
};

// Update an order by ID
export const updateOrder = async (req, res) => {
    try {
        const { error } = orderUpdateSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // If products are being updated, recalculate the total
        let total = order.total;
        if (req.body.products) {
            const products = await Product.find({
                _id: { $in: req.body.products.map(p => p.productId) }
            });
            if (products.length !== req.body.products.length) {
                return res.status(400).json({ error: 'Some products do not exist' });
            }

            total = req.body.products.reduce((acc, product) => {
                const productInfo = products.find(p => p._id.toString() === product.productId);
                return acc + product.quantity * productInfo.price;
            }, 0);

            // Update product associations
            order.products = req.body.products;
        }

        // Update the order details
        order.total = total;
        Object.assign(order, req.body);
        await order.save();

        const updatedOrder = await Order.findById(order._id).populate('user').populate('products.product');
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
};

// Delete an order by ID
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        await order.remove();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
};
