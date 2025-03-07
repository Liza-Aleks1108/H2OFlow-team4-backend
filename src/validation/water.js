import Joi from 'joi';

export const validationDrunkWaterShema = Joi.object({
  volume: Joi.string().min(2).max(4).required().messages({
    'string.base': 'Write down the amount of water you drink in the string!',
    'string.min': 'Minimum number of characters in volume 2!',
    'string.max': 'Maximum number of characters in volume 4!',
  }),
  day: Joi.string().min(8).max(12).required().messages({
    'string.base': 'Day must be a string!',
    'string.min': 'The minimum number of characters per day is 8!',
    'string.max': 'The maximum number of characters in a day is 12!',
  }),
  time: Joi.string().min(2).max(8).required().messages({
    'string.base': 'Time must be a string!',
    'string.min': 'The minimum number of characters per time is 2!',
    'string.max': 'The maximum number of characters in a eime is 8!',
  }),
  userId: Joi.string(),
});

export const validationUpdateDrunkWaterShema = Joi.object({
  volume: Joi.string().min(2).max(4).messages({
    'string.base': 'Write down the amount of water you drink in the string!',
    'string.min': 'Minimum number of characters in volume 2!',
    'string.max': 'Maximum number of characters in volume 4!',
  }),
  day: Joi.string().min(8).max(12).messages({
    'string.base': 'Day must be a string!',
    'string.min': 'The minimum number of characters per day is 8!',
    'string.max': 'The maximum number of characters in a day is 12!',
  }),
  time: Joi.string().min(2).max(8).messages({
    'string.base': 'Time must be a string!',
    'string.min': 'The minimum number of characters per time is 2!',
    'string.max': 'The maximum number of characters in a eime is 8!',
  }),
  userId: Joi.string(),
});

export const validationInOneDayShema = Joi.object({
  day: Joi.string().min(5).max(20).messages({
    'string.base': 'Data must be a string!',
    'string.min': 'Minimum number of characters in a date is 8!',
    'string.max': 'The maximum number of characters in a date is 20!',
  }),
});

export const validationInOneMonthShema = Joi.object({
  beginningOfTheMonth: Joi.string().min(4).max(12).required().messages({
    'string.base': 'BeginningOfTheMonth must be a string!',
    'string.min': 'Minimum number of characters in a beginningOfTheMonth is 8!',
    'string.max':
      'The maximum number of characters in a beginningOfTheMonth is 12!',
  }),
  endOfTheMonth: Joi.string().min(4).max(12).required().messages({
    'string.base': 'EndOfTheMonth must be a string!',
    'string.min': 'Minimum number of characters in a endOfTheMonth is 8!',
    'string.max': 'The maximum number of characters in a endOfTheMonth is 12!',
  }),
});
