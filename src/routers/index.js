//main route
import { Router } from 'express';
import userRouter from './userRoute.js';

const router = Router();

router.use('/users', userRouter);

export default router;