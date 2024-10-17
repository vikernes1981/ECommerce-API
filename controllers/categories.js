import Category from '../models/Category.js';
import { categorySchema, categoryUpdateSchema } from '../schemas/categorySchemas.js';
import mongoose from 'mongoose';

// Get all categories
export const getCategories = async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
};

// Create a category
export const createCategory = async (req, res) => {
    const { error } = categorySchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
};

// Get a specific category by ID
export const getCategoryById = async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
};

// Update a category by ID
export const updateCategory = async (req, res) => {
    const { error } = categoryUpdateSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    Object.assign(category, req.body);
    await category.save();
    res.json(category);
};

// Delete a category by ID
export const deleteCategory = async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    await category.remove();
    res.status(204).send();
};
