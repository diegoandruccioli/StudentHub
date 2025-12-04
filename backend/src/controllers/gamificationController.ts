import { Request, Response } from 'express';
import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2';

import { Livello, ObiettivoSbloccato } from '../types/gamification';

// --- XP, Livello corrente e progressi dell'utente ---
export const getGamificationStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        // xp_totali disponibile dal middleware protect
        const xpTotali = req.user?.xp_totali || 0;

        // Livello: xp_min <= xp_totali E (xp_max > xp_totali OPPURE xp_max è NULL)
        const query = `
            SELECT 
                numero, 
                nome, 
                xp_min, 
                xp_max 
            FROM livelli 
            WHERE xp_min <= ? AND (xp_max IS NULL OR xp_max > ?)
            ORDER BY numero DESC 
            LIMIT 1
        `;

        const [livelli] = await pool.query<Livello[]>(query, [xpTotali, xpTotali]);
        
        // Gestione caso nessun livello trovato
        let livelloCorrente = livelli[0];
        
        // Se non trova nulla (DB vuoto o XP negativi), fallback a livello 0
        if (!livelloCorrente) {
             livelloCorrente = { numero: 0, nome: 'Non Classificato', xp_min: 0, xp_max: 100 } as Livello;
        }

        // Calcolo progressione
        let progressPercent = 100;
        let xpRequiredForNext = xpTotali; 

        if (livelloCorrente.xp_max !== null) {
            const xpBase = livelloCorrente.xp_min;
            const xpNext = livelloCorrente.xp_max;
            
            // XP mancanti al prossimo livello
            xpRequiredForNext = xpNext;
            
            // Calcolo percentuale
            const totalRange = xpNext - xpBase;
            const userProgress = xpTotali - xpBase;
            
            progressPercent = totalRange > 0 
                ? Math.round((userProgress / totalRange) * 100) 
                : 100;
        }

        res.status(200).json({
            xp_totali: xpTotali,
            livello: {
                numero: livelloCorrente.numero,
                nome: livelloCorrente.nome
            },
            progress: {
                percentuale: progressPercent,
                xp_mancanti: livelloCorrente.xp_max ? (livelloCorrente.xp_max - xpTotali) : 0,
                prossima_soglia: livelloCorrente.xp_max
            }
        });

    } catch (error) {
        console.error('Errore getGamificationStatus:', error);
        res.status(500).json({ message: 'Errore nel recupero dello stato gamification' });
    }
};

// --- Obiettivi sbloccati dall'utente ---
export const getMyBadges = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        const query = `
            SELECT 
                ob.id AS id_obiettivo, 
                ob.nome, 
                ob.descrizione, 
                ob.xp_valore,
                os.data_conseguimento
            FROM obiettivi_sbloccati os
            JOIN obiettivi ob ON os.id_obiettivo = ob.id
            WHERE os.id_utente = ?
            ORDER BY os.data_conseguimento DESC
        `;
        
        const [badges] = await pool.query<ObiettivoSbloccato[]>(query, [userId]);

        res.status(200).json(badges);

    } catch (error) {
        console.error('Errore getMyBadges:', error);
        res.status(500).json({ message: 'Errore nel recupero dei badge utente' });
    }
};

// --- Catalogo completo degli obiettivi ---
export const getAllBadges = async (req: Request, res: Response): Promise<void> => {
    try {
        const query = `
            SELECT 
                id,
                nome,
                descrizione,
                xp_valore 
            FROM obiettivi 
            ORDER BY xp_valore ASC
        `;
        const [allBadges] = await pool.query(query);
        res.status(200).json(allBadges);
    } catch (error) {
        console.error('Errore getAllBadges:', error);
        res.status(500).json({ message: 'Errore nel recupero del catalogo badge' });
    }
};