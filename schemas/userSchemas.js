import Joi from 'joi';

const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const userUpdateSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    password: Joi.string().min(6),
});

export { userSchema, userUpdateSchema };
