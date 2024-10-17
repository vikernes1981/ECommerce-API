import Product from '../models/Product.js';
import { productSchema, productUpdateSchema } from '../schemas/productSchemas.js';
import Category from '../models/Category.js';

// Get all products
export const getProducts = async (req, res) => {
    const { categoryId } = req.query;
    const products = categoryId ? await Product.find({ categoryId }) : await Product.find();
    res.json(products);
};

// Create a product
export const createProduct = async (req, res) => {
    const { error } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const category = await Category.findById(req.body.categoryId);
    if (!category) return res.status(400).json({ error: 'Category does not exist' });

    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
};

// Get a specific product by ID
export const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
};

// Update a product by ID
export const updateProduct = async (req, res) => {
    const { error } = productUpdateSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    Object.assign(product, req.body);
    await product.save();
    res.json(product);
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await product.remove();
    res.status(204).send();
};
