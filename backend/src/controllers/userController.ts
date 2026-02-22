import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService';

export const getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Non autenticato' });

        const result = await userService.getLeaderboard(req.user.id);
        res.json(result);

    } catch (error) {
        next(error);
    }
};