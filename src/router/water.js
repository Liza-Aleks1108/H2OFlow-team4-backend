import { Router } from 'express';
import { isValidID } from '../middlewares/isValidId.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  addingDrunkWaterController,
  deleteWotertController,
  inOneDayWaterController,
  inOneMonthWaterController,
  patchWoterUpdatetController,
} from '../controllers/water.js';
import {
  validationDrunkWaterShema,
  validationInOneDayShema,
  validationInOneMonthShema,
  validationUpdateDrunkWaterShema,
} from '../validation/water.js';

const router = Router();

router.post(
  '/',
  validateBody(validationDrunkWaterShema),
  ctrlWrapper(addingDrunkWaterController),
);

router.patch(
  '/:woterId',
  validateBody(validationUpdateDrunkWaterShema),
  ctrlWrapper(patchWoterUpdatetController),
);

router.post(
  '/in-one-day',
  validateBody(validationInOneDayShema),
  ctrlWrapper(inOneDayWaterController),
);
// образец запроса
// {
// "day": "2025-03-05"
// }

router.post(
  '/in-one-month',
  validateBody(validationInOneMonthShema),
  ctrlWrapper(inOneMonthWaterController),
);
// образец запроса
// {
//     "beginningOfTheMonth": "2025-03-01",
//     "endOfTheMonth": "2025-03-31"
// }

router.delete('/:woterId', isValidID, ctrlWrapper(deleteWotertController));

export default router;
