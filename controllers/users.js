const User = require('../models/User');
const { userSchema, userUpdateSchema } = require('../schemas/userSchemas');

// Get all users
const getUsers = async (req, res) => {
    const users = await User.findAll();
    res.json(users);
};

// Create a user
const createUser = async (req, res) => {
    const { error } = userSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await User.create(req.body);
    res.status(201).json(user);
};

// Get a specific user by ID
const getUserById = async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
};

// Update a user by ID
const updateUser = async (req, res) => {
    const { error } = userUpdateSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update(req.body);
    res.json(user);
};

// Delete a user by ID
const deleteUser = async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.status(204).send();
};

module.exports = { getUsers, createUser, getUserById, updateUser, deleteUser };

