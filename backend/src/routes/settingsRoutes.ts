import express from 'express';
import * as settingsController from '../controllers/settingsController';
import { protect } from '../middleware/protect';

const router = express.Router();

// Applica la protezione a tutte le rotte: 
// solo utenti loggati possono vedere/modificare i propri settings
router.use(protect);

router.get('/', settingsController.getSettings);    // GET /api/settings
router.put('/', settingsController.updateSettings); // PUT /api/settings

export default router;