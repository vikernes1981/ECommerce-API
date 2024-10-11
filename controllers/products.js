const Product = require('../models/Product');
const { productSchema, productUpdateSchema } = require('../schemas/productSchemas');
const Category = require('../models/Category');

// Get all products
const getProducts = async (req, res) => {
    const { categoryId } = req.query;
    const products = categoryId ? await Product.findAll({ where: { categoryId } }) : await Product.findAll();
    res.json(products);
};

// Create a product
const createProduct = async (req, res) => {
    const { error } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const category = await Category.findByPk(req.body.categoryId);
    if (!category) return res.status(400).json({ error: 'Category does not exist' });

    const product = await Product.create(req.body);
    res.status(201).json(product);
};

// Get a specific product by ID
const getProductById = async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
};

// Update a product by ID
const updateProduct = async (req, res) => {
    const { error } = productUpdateSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await product.update(req.body);
    res.json(product);
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await product.destroy();
    res.status(204).send();
};

module.exports = { getProducts, createProduct, getProductById, updateProduct, deleteProduct };

