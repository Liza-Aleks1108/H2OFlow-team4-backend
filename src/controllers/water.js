import createHttpError from 'http-errors';
import {
  addingDrunkWater,
  deleteWoterRecord,
  searchByDate,
  searchForPeriod,
  updatedWoter,
} from '../services/water.js';
import dateConversion from '../utils/dateConversion.js';

export const addingDrunkWaterController = async (req, res) => {
  const oneTimeWaterIntake = await addingDrunkWater(req);
  res.status(201).json({
    status: 201,
    message: 'Water intake added',
    data: oneTimeWaterIntake,
  });
};

export const patchWoterUpdatetController = async (req, res, next) => {
  const { waterId } = req.params;
  const { _id: userId } = req.user;

  const result = await updatedWoter(waterId, userId, {
    ...req.body,
  });

  if (!result) {
    next(createHttpError(404, 'There is no such entry'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'The entry has been edited successfully!',
    data: result.record,
  });
};

export const inOneDayWaterController = async (req, res) => {
  // const date = req.body.day;
  const userId = req.user._id;
  const date = req.query.day;
  const oneDay = await searchByDate(date, userId);

  if (oneDay.length === 0) {
    res.json({
      status: 200,
      message: 'There is no data for this day!',
      oneDay,
    });
    return;
  }

  res.json({
    status: 200,
    oneDay,
  });
};

export const inOneMonthWaterController = async (req, res) => {
  // const beginning = req.body.beginningOfTheMonth;
  // const end = req.body.endOfTheMonth;
  const userId = req.user._id;
  const date = req.query.month;

  if (date.length < 7 || date.length > 7) {
    throw createHttpError(
      404,
      'Incorrect date! Date must match this format "2025-03".',
    );
  }

  const period = dateConversion(date);
  const beginning = period.beginningOfPeriod;
  const end = period.endOfPeriod;

  const oneMonth = await searchForPeriod(beginning, end, userId);

  if (oneMonth.length === 0) {
    res.json({
      status: 200,
      message: 'There is no data for this period!',
      oneMonth,
    });
  }

  res.json({
    status: 200,
    oneMonth,
  });
};

export const deleteWotertController = async (req, res, next) => {
  const { waterId } = req.params;
  console.log(req);
  const record = await deleteWoterRecord(waterId, req);

  if (!record) {
    next(createHttpError(404, 'No such entry found!'));
    return;
  }

  res.status(204).send();
};
