import createHttpError from 'http-errors';
import {
  addingDrunkWater,
  deleteWoterRecord,
  searchByDate,
  searchForPeriod,
  updatedWoter,
} from '../services/water.js';

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
  const date = req.body.day;
  const oneDay = await searchByDate(date);

  if (oneDay.length === 0) {
    throw createHttpError(404, 'There is no data for this day');
  }

  res.json({
    status: 200,
    oneDay,
  });
};

export const inOneMonthWaterController = async (req, res) => {
  const beginning = req.body.beginningOfTheMonth;
  const end = req.body.endOfTheMonth;

  const oneMonth = await searchForPeriod(beginning, end);

  if (oneMonth.length === 0) {
    throw createHttpError(404, 'There is no data for this day');
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
