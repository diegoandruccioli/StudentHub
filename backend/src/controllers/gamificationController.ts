import { Request, Response, NextFunction } from 'express';
import { gamificationService } from '../services/gamificationService';
import { logger } from '../utils/logger';

export const getGamificationStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const xpTotali = req.user?.xp_totali || 0;
        const status = await gamificationService.getStatus(xpTotali);
        res.status(200).json(status);
    } catch (error) {
        next(error);
    }
};

export const getMyBadges = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Utente non autenticato' });
            return;
        }
        const badges = await gamificationService.getUserBadges(userId);
        res.status(200).json(badges);
    } catch (error) {
        next(error);
    }
};

export const getAllBadges = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const allBadges = await gamificationService.getAllBadges();
        res.status(200).json(allBadges);
    } catch (error) {
        next(error);
    }
};

export const syncBadges = gamificationService.syncBadges; 