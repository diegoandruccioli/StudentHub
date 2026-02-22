import { Request, Response, NextFunction } from 'express';
import { settingsService } from '../services/settingsService';
import { logger } from '../utils/logger';

export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Non autenticato' });

        const settings = await settingsService.getSettings(req.user.id);
        res.json(settings);
    } catch (error) {
        if (error instanceof Error && error.message === 'Impostazioni non trovate') {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Non autenticato' });

        const result = await settingsService.updateSettings(req.user.id, req.body);

        res.json({ 
            message: 'Impostazioni aggiornate con successo',
            settings: result
        });

    } catch (error) {
        if (error instanceof Error &&
            (error.message.startsWith('Il tema') ||
             error.message.startsWith('La soglia') ||
             error.message.startsWith('Le soglie'))) {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
};