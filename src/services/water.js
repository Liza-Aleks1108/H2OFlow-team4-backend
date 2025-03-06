import { WaterCollection } from '../dB/water.js';

export const addingDrunkWater = async (payload) => {
  const waterIntake = await WaterCollection.create({
    ...payload.body,
    userId: payload.user._id,
  });
  return waterIntake;
};

export const updatedWoter = async (woterId, userId, payload, options = {}) => {
  const updatedWoter = await WaterCollection.findOneAndUpdate(
    {
      userId,
      _id: woterId,
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

export const deleteWoterRecord = async (woterId, req) => {
  const record = await WaterCollection.findOneAndDelete({
    userId: req.user._id,
    _id: woterId,
  });
  return record;
};
