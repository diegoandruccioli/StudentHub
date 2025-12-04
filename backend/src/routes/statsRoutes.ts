import express from 'express';
import * as statsController from '../controllers/statsController';
import { protect } from '../middleware/protect';

const router = express.Router();

// Applica la protezione a tutte le rotte: 
// solo utenti loggati possono vedere/modificare i propri settings
router.use(protect);

router.get('/', statsController.getStats); // GET /api/stats

export default router;