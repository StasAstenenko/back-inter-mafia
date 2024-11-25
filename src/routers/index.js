//main route
import { Router } from 'express';
import userRouter from './userRoute.js';

const router = Router();

router.use('/api/users', userRouter);

export default router;