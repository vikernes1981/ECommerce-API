
const Category = require('../models/Category');
const { categorySchema, categoryUpdateSchema } = require('../schemas/categorySchemas');

// Get all categories
const getCategories = async (req, res) => {
    const categories = await Category.findAll();
    res.json(categories);
};

// Create a category
const createCategory = async (req, res) => {
    const { error } = categorySchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const category = await Category.create(req.body);
    res.status(201).json(category);
};

// Get a specific category by ID
const getCategoryById = async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
};

// Update a category by ID
const updateCategory = async (req, res) => {
    const { error } = categoryUpdateSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    await category.update(req.body);
    res.json(category);
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    await category.destroy();
    res.status(204).send();
};

module.exports = { getCategories, createCategory, getCategoryById, updateCategory, deleteCategory };
