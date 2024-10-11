const Order = require('../models/Order');
const { orderSchema, orderUpdateSchema } = require('../schemas/orderSchemas');
const User = require('../models/User');
const Product = require('../models/Product');

// Get all orders
const getOrders = async (req, res) => {
    console.log('Received GET request for orders');
    try {
        const orders = await Order.findAll({ include: [User, { model: Product, through: { attributes: ['quantity'] } }] });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error); // Log the error for better visibility
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
};


// Create an order
const createOrder = async (req, res) => {
    try {
        const { error } = orderSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const user = await User.findByPk(req.body.userId);
        if (!user) return res.status(400).json({ error: 'User does not exist' });

        // Find the products in the order request
        const products = await Product.findAll({
            where: { id: req.body.products.map(p => p.productId) }
        });
        if (products.length !== req.body.products.length) {
            return res.status(400).json({ error: 'Some products do not exist' });
        }

        // Calculate the total price of the order
        const total = req.body.products.reduce((acc, product) => {
            const productInfo = products.find(p => p.id === product.productId);
            return acc + product.quantity * productInfo.price;
        }, 0);

        // Create the order
        const order = await Order.create({
            userId: req.body.userId,
            total
        });

        // Associate products with the order
        await order.addProducts(req.body.products.map(product => ({
            productId: product.productId,
            quantity: product.quantity
        })));

        // Return the created order
        const createdOrder = await Order.findByPk(order.id, {
            include: [User, { model: Product, through: { attributes: ['quantity'] } }]
        });
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
};

// Get a specific order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, { 
            include: [User, { model: Product, through: { attributes: ['quantity'] } }] 
        });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve order' });
    }
};

// Update an order by ID
const updateOrder = async (req, res) => {
    try {
        const { error } = orderUpdateSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // If products are being updated, recalculate the total
        let total = order.total;
        if (req.body.products) {
            const products = await Product.findAll({
                where: { id: req.body.products.map(p => p.productId) }
            });
            if (products.length !== req.body.products.length) {
                return res.status(400).json({ error: 'Some products do not exist' });
            }

            total = req.body.products.reduce((acc, product) => {
                const productInfo = products.find(p => p.id === product.productId);
                return acc + product.quantity * productInfo.price;
            }, 0);

            // Update product associations
            await order.setProducts(req.body.products.map(product => ({
                productId: product.productId,
                quantity: product.quantity
            })));
        }

        // Update the order details
        await order.update({ ...req.body, total });
        const updatedOrder = await Order.findByPk(order.id, {
            include: [User, { model: Product, through: { attributes: ['quantity'] } }]
        });

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
};

// Delete an order by ID
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        await order.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
};

module.exports = { getOrders, createOrder, getOrderById, updateOrder, deleteOrder };

