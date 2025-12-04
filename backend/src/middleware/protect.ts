import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2';

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
            
            // RowDataPacket[] è il tipo di ritorno standard per le query SELECT di mysql2
            const [users] = await pool.query<RowDataPacket[]>('SELECT id, nome, cognome, email, ruolo, xp_totali FROM utenti WHERE id = ?', [decoded.id]);
            
            if (users.length === 0) {
                 res.status(401).json({ message: 'Utente non trovato' });
                 return;
            }

            // il tipo di 'req.user' è gestito dal file express.d.ts
            req.user = users[0] as any; 
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Non autorizzato, token non valido' });
        }
    } else {
        res.status(401).json({ message: 'Non autorizzato, nessun token' });
    }
};