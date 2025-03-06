import Joi from 'joi';

export const validationDrunkWaterShema = Joi.object({
  volume: Joi.string().min(2).max(4).required().messages({
    'string.base': 'Write down the amount of water you drink in the string!',
    'string.min': 'Minimum number of characters in volume 2!',
    'string.max': 'Maximum number of characters in volume 4!',
  }),
  date: Joi.string().min(8).max(20).required().messages({
    'string.base': 'Data must be a string!',
    'string.min': 'Minimum number of characters in a date is 8!',
    'string.max': 'The maximum number of characters in a date is 20!',
  }),
  userId: Joi.string(),
});

export const validationUpdateDrunkWaterShema = Joi.object({
  volume: Joi.string().min(2).max(4).messages({
    'string.base': 'Write down the amount of water you drink in the string!',
    'string.min': 'Minimum number of characters in volume 2!',
    'string.max': 'Maximum number of characters in volume 4!',
  }),
  date: Joi.string().min(8).max(20).messages({
    'string.base': 'Data must be a string!',
    'string.min': 'Minimum number of characters in a date is 8!',
    'string.max': 'The maximum number of characters in a date is 20!',
  }),
  userId: Joi.string(),
});
