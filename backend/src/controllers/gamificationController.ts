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

// --- Funzione Helper per sincronizzare i badge (Assegna o Revoca) ---
export const syncBadges = async (userId: number, connection: any): Promise<{ newBadges: ObiettivoSbloccato[], revokedBadgeIds: number[] }> => {
    const newBadges: ObiettivoSbloccato[] = [];
    const revokedBadgeIds: number[] = [];

    // 1. Recupera tutti gli esami dell'utente
    const [exams] = await connection.query('SELECT * FROM esami WHERE id_utente = ? ORDER BY data ASC', [userId]);

    // 2. Recupera i badge POSSEDUTI
    const [existingBadgesRows] = await connection.query('SELECT id_obiettivo FROM obiettivi_sbloccati WHERE id_utente = ?', [userId]);
    const existingBadgeIds = new Set<number>(existingBadgesRows.map((r: any) => r.id_obiettivo));

    // --- DEFINIZIONE REGOLE BADGE ---
    const badgeRules = [
        {
            id: 1, // Primo Passo
            check: () => exams.length >= 1
        },
        {
            id: 2, // Secchione (Una lode)
            check: () => exams.some((e: any) => e.lode === 1 || e.lode === true)
        },
        {
            id: 3, // Maratoneta (3 esami in un mese)
            check: () => {
                const examsByMonth: { [key: string]: number } = {};
                for (const exam of exams) {
                    const date = new Date(exam.data);
                    const key = `${date.getFullYear()}-${date.getMonth()}`;
                    examsByMonth[key] = (examsByMonth[key] || 0) + 1;
                    if (examsByMonth[key] >= 3) return true;
                }
                return false;
            }
        },
        {
            id: 4, // Giro di Boa (90 CFU)
            check: () => {
                const totalCfu = exams.reduce((sum: number, e: any) => sum + e.cfu, 0);
                return totalCfu >= 90;
            }
        }
    ];

    // --- ESECUZIONE CONTROLLI ---
    for (const rule of badgeRules) {
        const isMet = rule.check();
        const hasBadge = existingBadgeIds.has(rule.id);

        if (isMet && !hasBadge) {
            // ASSEGNA
            await assignBadge(userId, rule.id, connection, newBadges);
        } else if (!isMet && hasBadge) {
            // REVOCA
            await revokeBadge(userId, rule.id, connection, revokedBadgeIds);
        }
    }

    return { newBadges, revokedBadgeIds };
};

// Funzione helper privata per assegnare badge
const assignBadge = async (userId: number, badgeId: number, connection: any, newBadgesList: ObiettivoSbloccato[]) => {
    const [badgeRows] = await connection.query('SELECT * FROM obiettivi WHERE id = ?', [badgeId]);
    if (badgeRows.length === 0) return;
    const badge = badgeRows[0];

    await connection.query('INSERT INTO obiettivi_sbloccati (id_utente, id_obiettivo, data_conseguimento) VALUES (?, ?, NOW())', [userId, badgeId]);
    await connection.query('UPDATE utenti SET xp_totali = xp_totali + ? WHERE id = ?', [badge.xp_valore, userId]);

    newBadgesList.push({
        id_obiettivo: badge.id,
        nome: badge.nome,
        descrizione: badge.descrizione,
        xp_valore: badge.xp_valore,
        data_conseguimento: new Date()
    } as ObiettivoSbloccato);
};

// Funzione helper privata per revocare badge
const revokeBadge = async (userId: number, badgeId: number, connection: any, revokedList: number[]) => {
    const [badgeRows] = await connection.query('SELECT xp_valore FROM obiettivi WHERE id = ?', [badgeId]);
    if (badgeRows.length === 0) return;
    const xpValore = badgeRows[0].xp_valore;

    await connection.query('DELETE FROM obiettivi_sbloccati WHERE id_utente = ? AND id_obiettivo = ?', [userId, badgeId]);
    // Sottrai XP, ma evita di andare sotto zero (opzionale, ma sicuro)
    await connection.query('UPDATE utenti SET xp_totali = GREATEST(0, xp_totali - ?) WHERE id = ?', [xpValore, userId]);
    
    revokedList.push(badgeId);
};