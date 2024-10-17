import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userSchema from '../schema/userSchema.js';

dotenv.config();

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    const User = mongoose.model('User', userSchema);

    const createDummyUsers = async () => {
        const dummyUsers = [
            { username: 'user1', name: 'John Doe', email: 'john@example.com', password: 'password123' },
            { username: 'user2', name: 'Jane Smith', email: 'jane@example.com', password: 'password123' },
            { username: 'user3', name: 'Alice Johnson', email: 'alice@example.com', password: 'password123' }
        ];

        try {
            await User.insertMany(dummyUsers);
            console.log('Dummy users have been added successfully.');
        } catch (error) {
            console.error('Error adding dummy users:', error);
        }
    };

    createDummyUsers();
};

connectDB();
