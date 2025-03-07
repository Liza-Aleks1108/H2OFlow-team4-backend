import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const validationUpdateUserSchema = Joi.object({
  name: Joi.string().min(2).max(12).optional(),
  email: Joi.string().email().optional(),
  gender: Joi.string().valid('woman', 'man').optional(),
  weight: Joi.number().min(1).max(500).optional(),
  dailySportTime: Joi.number().min(0).max(24).optional(),
  dailyNorm: Joi.number().min(500).max(15000).optional(),
  avatarUrl: Joi.string().uri().optional(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
