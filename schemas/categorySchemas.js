import Joi from 'joi';

const categorySchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
});

const categoryUpdateSchema = Joi.object({
    name: Joi.string().min(3).max(30),
});

export { categorySchema, categoryUpdateSchema };
