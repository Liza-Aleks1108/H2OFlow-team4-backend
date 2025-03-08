import { WaterCollection } from '../dB/water.js';

export const addingDrunkWater = async (payload) => {
  const waterIntake = await WaterCollection.create({
    ...payload.body,
    userId: payload.user._id,
  });
  return waterIntake;
};

export const updatedWoter = async (waterId, userId, payload, options = {}) => {
  const updatedWoter = await WaterCollection.findOneAndUpdate(
    {
      userId,
      _id: waterId,
    },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!updatedWoter || !updatedWoter.value) return null;

  return {
    record: updatedWoter.value,
    isNew: Boolean(updatedWoter?.lastErrorObject.upserted),
  };
};

export const searchByDate = async (date) => {
  const oneDay = await WaterCollection.find({ day: { $eq: date } });

  return oneDay;
};

export const searchForPeriod = async (beginning, end) => {
  const oneDay = await WaterCollection.find()
    .where('day')
    .gte(beginning)
    .lte(end);

  return oneDay;
};

export const deleteWoterRecord = async (waterId, req) => {
  const record = await WaterCollection.findOneAndDelete({
    userId: req.user._id,
    _id: waterId,
  });
  return record;
};
