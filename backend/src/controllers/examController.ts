import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// GET: Ottieni tutti gli esami CON FILTRI
export const getExams = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Utente non autenticato' });

        const { sortBy, order, year } = req.query;

        // Whitelist per evitare SQL Injection
        const validSortFields = ['data', 'voto', 'cfu', 'nome'];
        const validOrderDirs = ['ASC', 'DESC'];

        const sortField = validSortFields.includes(sortBy as string) ? sortBy : 'data';
        const orderDir = validOrderDirs.includes((order as string)?.toUpperCase()) ? (order as string).toUpperCase() : 'DESC';

        let query = 'SELECT * FROM esami WHERE id_utente = ?';
        const queryParams: any[] = [req.user.id];

        // Filtro Anno
        if (year && year !== 'all') {
            query += ' AND YEAR(data) = ?';
            queryParams.push(year);
        }

        query += ` ORDER BY ${sortField} ${orderDir}`;

        const [exams] = await pool.query(query, queryParams);
        res.json(exams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore nel recupero esami' });
    }
};

// POST: Aggiungi esame (BATCH - Lista di esami)
export const addExam = async (req: Request, res: Response) => {
    const connection = await pool.getConnection();
    try {
        if (!req.user) return res.status(401).json({ message: 'Utente non autenticato' });

        const exams = req.body;

        // Controllo fondamentale: deve essere un array!
        if (!Array.isArray(exams)) {
            return res.status(400).json({ message: 'Il formato dati deve essere una lista di esami' });
        }

        if (exams.length === 0) {
            return res.status(400).json({ message: 'La lista esami è vuota' });
        }

        await connection.beginTransaction();

        let totalXp = 0;
        const insertedIds = [];

        for (const exam of exams) {
            const { nome, voto, lode, cfu, data } = exam;
            
            if (!nome || !voto || !cfu || !data) {
                throw new Error('Dati mancanti per uno degli esami');
            }

            let xp = voto * cfu;
            if (lode) xp += 50;
            totalXp += xp;

            const [result] = await connection.query<ResultSetHeader>(
                'INSERT INTO esami (id_utente, nome, voto, lode, cfu, data, xp_guadagnati) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [req.user.id, nome, voto, lode || false, cfu, data, xp]
            );
            insertedIds.push(result.insertId);
        }

        await connection.query(
            'UPDATE utenti SET xp_totali = xp_totali + ? WHERE id = ?',
            [totalXp, req.user.id]
        );

        await connection.commit();

        res.status(201).json({ 
            message: 'Esami aggiunti con successo!', 
            ids: insertedIds,
            xp_guadagnati: totalXp 
        });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        const msg = error instanceof Error ? error.message : 'Errore aggiunta esame';
        res.status(500).json({ message: msg });
    } finally {
        connection.release();
    }
};

// DELETE: Rimuovi esame
export const deleteExam = async (req: Request, res: Response) => {
    const connection = await pool.getConnection();
    try {
        if (!req.user) return res.status(401).json({ message: 'Utente non autenticato' });

        const { id } = req.params;

        const [exam] = await connection.query<RowDataPacket[]>('SELECT xp_guadagnati FROM esami WHERE id = ? AND id_utente = ?', [id, req.user.id]);
        
        if (exam.length === 0) {
            return res.status(404).json({ message: 'Esame non trovato o non autorizzato' });
        }

        const xpDaRimuovere = exam[0].xp_guadagnati;

        await connection.beginTransaction();
        await connection.query('DELETE FROM esami WHERE id = ?', [id]);
        await connection.query('UPDATE utenti SET xp_totali = xp_totali - ? WHERE id = ?', [xpDaRimuovere, req.user.id]);
        await connection.commit();
        
        res.json({ message: 'Esame eliminato, XP ricalcolati' });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Errore eliminazione' });
    } finally {
        connection.release();
    }
};