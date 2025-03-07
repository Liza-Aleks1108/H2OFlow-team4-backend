import { Router } from 'express';
import { getUsersCountController } from '../controllers/users.js';

const router = Router();

router.get('/count', getUsersCountController);

export default router;
