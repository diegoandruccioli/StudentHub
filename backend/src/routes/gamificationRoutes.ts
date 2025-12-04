import { Router } from 'express';
import { protect } from '../middleware/protect';
import { 
    getGamificationStatus,
    getMyBadges,
    getAllBadges
} from '../controllers/gamificationController';

const router = Router();

router.use(protect);

router.get('/status', getGamificationStatus);    // XP, Livello, Barra progresso
router.get('/my-badges', getMyBadges);           // Obiettivo che ho completato
router.get('/badges', getAllBadges);             // Tutti gli obiettivi esistenti

export default router;