import { Router } from 'express';
import { isValidID } from '../middlewares/isValidId.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  addingDrunkWaterController,
  deleteWotertController,
  patchWoterUpdatetController,
} from '../controllers/water.js';
import {
  validationDrunkWaterShema,
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

router.delete('/:woterId', isValidID, ctrlWrapper(deleteWotertController));

export default router;
