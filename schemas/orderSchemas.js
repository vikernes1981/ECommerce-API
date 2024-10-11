const Joi = require('joi');

const orderSchema = Joi.object({
    userId: Joi.number().required(), // Example of required field for creating an order
    products: Joi.array().items(Joi.object({
        productId: Joi.number().required(),
        quantity: Joi.number().required(),
    })).required(),
    // Ensure 'total' is not included here for create orders.
});

const orderUpdateSchema = Joi.object({
    products: Joi.array().items(Joi.object({
        productId: Joi.number().required(),
        quantity: Joi.number().required(),
    })),
    // Ensure 'total' is not included here either.
});

module.exports = { orderSchema, orderUpdateSchema };
