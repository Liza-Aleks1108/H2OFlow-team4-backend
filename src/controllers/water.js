import createHttpError from 'http-errors';
import {
  addingDrunkWater,
  deleteWoterRecord,
  updatedWoter,
} from '../services/water.js';

export const addingDrunkWaterController = async (req, res) => {
  console.log(req.body);
  const oneTimeWaterIntake = await addingDrunkWater(req);
  res.status(201).json({
    status: 201,
    message: 'Water intake added',
    data: oneTimeWaterIntake,
  });
};

export const patchWoterUpdatetController = async (req, res, next) => {
  const { woterId } = req.params;
  const { _id: userId } = req.user;

  const result = await updatedWoter(woterId, userId, {
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

export const deleteWotertController = async (req, res, next) => {
  const { woterId } = req.params;
  const record = await deleteWoterRecord(woterId, req);

  if (!record) {
    next(createHttpError(404, 'No such entry found!'));
    return;
  }

  res.status(204).send();
};
