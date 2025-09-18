const Joi = require('joi');

const companyBodySchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().allow('').max(2000),
  industry: Joi.string().trim().min(2).max(80).required(),
  location: Joi.string().trim().min(2).max(120).required(),
  size: Joi.alternatives().try(Joi.number().integer().min(0), Joi.string().allow('')).default(''),
  foundedYear: Joi.alternatives().try(
    Joi.number().integer().min(1800).max(new Date().getFullYear()),
    // Joi.string().allow('')
  ).default(''),
  isActive: Joi.alternatives().try(Joi.boolean(), Joi.string().valid('true', 'false', '')).default(''),
});

const objectIdParamSchema = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});

const listQuerySchema = Joi.object({
  name: Joi.string().allow('').optional(),
  description: Joi.string().allow('').optional(),
  industry: Joi.string().allow('').optional(),
  location: Joi.string().allow('').optional(), 
  sizeMin: Joi.number().integer().min(0).optional(),
  sizeMax: Joi.number().integer().min(0).optional(),
  foundedStart: Joi.number().integer().min(1800).optional(),
  foundedEnd: Joi.number().integer().min(1800).optional(),
  isActive: Joi.string().valid('true', 'false', '').optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  sort: Joi.string().allow('').optional(),
  order: Joi.string().valid('asc', 'desc').optional(),
});

module.exports = {
  companyBodySchema,
  listQuerySchema,
  objectIdParamSchema,
};


