import { Router } from 'express';
import { protect } from '../middleware/protect';
import { protectAdmin, protectSuperAdmin } from '../middleware/adminProtect';
import { 
    getAllUsers, 
    updateUserRole,
    getAdminStats,
    getGlobalRanking,
    deleteAdminAccount
} from '../controllers/adminController';

const router = Router();

router.use(protect);

// --- Area Admin & SuperAdmin (Lettura e Statistiche) ---
router.get('/users', protectAdmin, getAllUsers);                    // Lista utenti
router.get('/stats/exam-count', protectAdmin, getAdminStats);       // Statistiche esami
router.get('/stats/ranking', protectAdmin, getGlobalRanking);       // Classifica globale

// --- Area SuperAdmin (Gestione Poteri e Utenze Admin) ---
router.put('/users/:id/role', protectSuperAdmin, updateUserRole);   // Cambiare ruoli

router.delete('/users/:id', protectSuperAdmin, deleteAdminAccount); // Eliminare Admin

export default router;