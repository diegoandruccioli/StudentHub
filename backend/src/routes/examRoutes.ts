import express from 'express';
import * as examController from '../controllers/examController';
import { protect } from '../middleware/protect';

const router = express.Router();

router.use(protect);

router.get('/', examController.getExams);
router.post('/', examController.addExam);
router.put('/:id', examController.updateExam);
router.delete('/:id', examController.deleteExam);

export default router;