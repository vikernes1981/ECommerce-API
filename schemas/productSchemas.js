const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    description: Joi.string(),
    price: Joi.number().positive().required(),
    categoryId: Joi.number().integer().required(),
});

const productUpdateSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    description: Joi.string(),
    price: Joi.number().positive(),
    categoryId: Joi.number().integer(),
});

module.exports = { productSchema, productUpdateSchema };
