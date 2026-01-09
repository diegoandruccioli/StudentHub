import { Request, Response } from 'express';
import { adminService } from '../services/adminService';

// --- GET: FUNZIONALITÀ DI LETTURA (Admin) ---

// Lista utenti
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const result = await adminService.getAllUsers(page, limit);
        res.status(200).json(result);
    } catch (error) {
        console.error('Errore getAllUsers:', error);
        res.status(500).json({ message: 'Errore nel recupero della lista utenti' });
    }
};

// Statistiche amministrative
export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const stats = await adminService.getAdminStats();
        res.status(200).json(stats);
    } catch (error) {
        console.error('Errore getAdminStats:', error);
        res.status(500).json({ message: 'Errore nel recupero delle statistiche' });
    }
};

// Classifica globale
export const getGlobalRanking = async (req: Request, res: Response): Promise<void> => {
    try {
        const ranking = await adminService.getGlobalRanking();
        res.status(200).json(ranking);
    } catch (error) {
        console.error('Errore getGlobalRanking:', error);
        res.status(500).json({ message: 'Errore nel recupero della classifica globale' });
    }
};


// --- WRITE: FUNZIONALITÀ CRITICHE (Solo SuperAdmin) ---

// Aggiorna il ruolo di un utente
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { nuovo_ruolo } = req.body;

    try {
        // req.user è ora tipizzato correttamente (UserPayload) grazie a express.d.ts
        if (!req.user) {
            res.status(401).json({ message: 'Non autorizzato' });
            return;
        }
        const currentUserId = req.user.id;
        const result = await adminService.updateUserRole(parseInt(id), nuovo_ruolo, currentUserId);

        res.status(200).json({ 
            message: 'Ruolo aggiornato con successo',
            userId: result.userId,
            newRole: result.newRole
        });

    } catch (error: any) {
        console.error('Errore updateUserRole:', error);
        if (error.message === 'Utente non trovato') {
             res.status(404).json({ message: error.message });
        } else if (error.message.startsWith('Ruolo non valido') || error.message.startsWith('Non puoi')) {
             res.status(400).json({ message: error.message });
        } else {
             res.status(500).json({ message: 'Errore nell\'aggiornamento del ruolo' });
        }
    }
};

// Elimina account Admin
export const deleteAdminAccount = async (req: Request, res: Response): Promise<void> => {
    const userIdToDelete = req.params.id;

    try {
        if (!req.user) {
            res.status(401).json({ message: 'Non autorizzato' });
            return;
        }
        const currentUserId = req.user.id;
        await adminService.deleteAdminAccount(parseInt(userIdToDelete), currentUserId);

        res.status(200).json({ message: 'Account Admin eliminato con successo.' });

    } catch (error: any) {
        console.error('Errore deleteAdminAccount:', error);
        if (error.message === 'Utente non trovato.') {
            res.status(404).json({ message: error.message });
        } else if (error.message.startsWith('Questa azione') || error.message.startsWith('Non puoi')) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Errore nell\'eliminazione dell\'account.' });
        }
    }
};
