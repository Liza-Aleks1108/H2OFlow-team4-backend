import { Router } from 'express';
import auth from './authRoute.js';
import water from './water.js';

const router = Router();

router.use('/users', auth);
router.use('/water', water);

export default router;
