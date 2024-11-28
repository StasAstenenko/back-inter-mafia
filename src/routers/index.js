//main route
import { Router } from 'express';
import userRouter from './userRoute.js';
import waterRouter from './waterRoute.js';


const router = Router();

router.use('/api/users', userRouter);

router.use('/api/water', waterRouter);



export default router;

