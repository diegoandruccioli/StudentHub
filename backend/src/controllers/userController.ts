import { Request, Response } from 'express';
import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2';

export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        // Controllo utente loggato
        if (!req.user) return res.status(401).json({ message: 'Non autenticato' });

        // Classifica globale
        const [leaderboard] = await pool.query<RowDataPacket[]>(`
            SELECT id, nome, cognome, xp_totali 
            FROM utenti 
            WHERE ruolo = "0" 
            ORDER BY xp_totali DESC 
            LIMIT 50
        `);

        // Calcolo posizione utente loggato
        const [rankResult] = await pool.query<RowDataPacket[]>(`
            SELECT COUNT(*) + 1 as \`rank\` 
            FROM utenti 
            WHERE xp_totali > (SELECT xp_totali FROM utenti WHERE id = ?) AND ruolo = "0"
        `, [req.user.id]);

        const myRank = rankResult[0].rank;

        // Risposta per frontend
        res.json({
            leaderboard, // Array studenti ordinati
            myRank       // Posizione utente loggato
        });

    } catch (error) {
        console.error('Errore recupero classifica:', error);
        res.status(500).json({ message: 'Errore recupero classifica' });
    }
};