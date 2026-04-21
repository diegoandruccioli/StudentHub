import { Request, Response, NextFunction } from 'express';
import { examService } from '../services/examService';
import { logger } from '../utils/logger';
import { examListSchema, examUpdateSchema } from '../validators/examValidator';

export const getExams = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Utente non autenticato' });

        const filters = {
            sortBy: req.query.sortBy as string,
            order: req.query.order as string,
            year: req.query.year as string
        };

        const exams = await examService.getExams(req.user.id, filters);
        res.json(exams);
    } catch (error) {
        next(error);
    }
};


export const addExam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Utente non autenticato' });

        const parsed = examListSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: parsed.error.issues[0].message });
        }

        const result = await examService.addExams(req.user.id, parsed.data);

        res.status(201).json({
            message: 'Esami aggiunti con successo!',
            ids: result.ids,
            xp_totali_guadagnati: result.totalXp,
            nuovi_badge: result.newBadges
        });

    } catch (error) {
        next(error);
    }
};


export const updateExam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Utente non autenticato' });

        const parsed = examUpdateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: parsed.error.issues[0].message });
        }

        const { id } = req.params;

        const result = await examService.updateExam(req.user.id, parseInt(id), parsed.data);

        res.json({
            message: 'Esame aggiornato',
            nuovi_badge: result.newBadges,
            badge_revocati: result.revokedBadgeIds,
            xp_difference: result.xpDifference
        });

    } catch (error) {
        if (error instanceof Error && error.message === 'Esame non trovato o non autorizzato') {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};


export const deleteExam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Utente non autenticato' });

        const { id } = req.params;
        await examService.deleteExam(req.user.id, parseInt(id));

        res.json({ message: 'Esame eliminato, XP ricalcolati' });

    } catch (error) {
        if (error instanceof Error && error.message === 'Esame non trovato o non autorizzato') {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};