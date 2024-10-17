import User from '../models/User.js';
import { userSchema, userUpdateSchema } from '../schemas/userSchemas.js';

// Get all users
export const getUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
};

// Create a user
export const createUser = async (req, res) => {
    const { error } = userSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
};

// Get a specific user by ID
export const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
};

// Update a user by ID
export const updateUser = async (req, res) => {
    const { error } = userUpdateSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    Object.assign(user, req.body);
    await user.save();
    res.json(user);
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await User.deleteOne({ _id: req.params.id });
    res.status(204).send();
};
