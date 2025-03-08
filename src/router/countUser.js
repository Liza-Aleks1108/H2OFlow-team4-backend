import { Router } from 'express';
import { getUsersCountController } from '../controllers/users.js';

const countUser = Router();

countUser.get('/count', getUsersCountController);

export default countUser;
