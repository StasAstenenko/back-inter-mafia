//water route
import express from 'express';

const router = express.Router();

router.use('/:userId');
router.get('/:userId/day');
router.get('/:userId/month');
router.post('/:userId');
router.patch('/:userId');
router.delete('/:userId');

export default router;
