import { pool } from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { gamificationService } from './gamificationService';
import { ExamInput, ExamUpdate } from '../types/exam';

export const examService = {
    /**
     * Recupera la lista degli esami di un utente con supporto a ordinamento e filtro per anno.
     *
     * @param userId - ID dell'utente proprietario degli esami
     * @param filters - Opzioni di filtro e ordinamento
     * @param filters.sortBy - Campo di ordinamento (valori validi: `data`, `voto`, `cfu`, `nome`; default: `data`)
     * @param filters.order - Direzione di ordinamento (`ASC` | `DESC`; default: `DESC`)
     * @param filters.year - Anno accademico da filtrare (`'all'` per rimuovere il filtro)
     * @returns Array di oggetti esame dal database
     */
    async getExams(userId: number, filters: { sortBy?: string, order?: string, year?: string }) {
        const { sortBy, order, year } = filters;

        const validSortFields = ['data', 'voto', 'cfu', 'nome'];
        const validOrderDirs = ['ASC', 'DESC'];

        const sortField = validSortFields.includes(sortBy as string) ? sortBy : 'data';
        const orderDir = validOrderDirs.includes((order as string)?.toUpperCase())
            ? (order as string).toUpperCase()
            : 'DESC';

        let query = 'SELECT * FROM esami WHERE id_utente = ?';
        const queryParams: (string | number)[] = [userId];

        if (year && year !== 'all') {
            query += ' AND YEAR(data) = ?';
            queryParams.push(year);
        }

        query += ` ORDER BY ${sortField} ${orderDir}`;

        const [exams] = await pool.query(query, queryParams);
        return exams;
    },

    /**
     * Inserisce uno o più esami in una singola transazione atomica.
     * Aggiorna gli XP totali dell'utente e sincronizza i badge di gamification.
     *
     * @param userId - ID dell'utente a cui associare gli esami
     * @param exams - Array di esami da inserire (validati con `examListSchema`)
     * @returns Oggetto con gli ID inseriti, XP totali guadagnati e nuovi badge sbloccati
     * @throws Esegue rollback automatico in caso di errore durante l'inserimento
     */
    async addExams(userId: number, exams: ExamInput[]) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            let totalXp = 0;
            const insertedIds = [];

            for (const exam of exams) {
                const { nome, voto, lode, cfu, data } = exam;
                let xp = voto * cfu;
                if (lode) xp += 50;
                totalXp += xp;

                const [result] = await connection.query<ResultSetHeader>(
                    'INSERT INTO esami (id_utente, nome, voto, lode, cfu, data, xp_guadagnati) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [userId, nome, voto, lode || false, cfu, data, xp]
                );
                insertedIds.push(result.insertId);
            }

            await connection.query(
                'UPDATE utenti SET xp_totali = xp_totali + ? WHERE id = ?',
                [totalXp, userId]
            );

            const { newBadges } = await gamificationService.syncBadges(userId, connection);

            await connection.commit();
            return { ids: insertedIds, totalXp, newBadges };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    /**
     * Aggiorna un esame esistente in una transazione atomica.
     * Ricalcola gli XP dell'utente in base alla differenza tra vecchi e nuovi XP.
     * Sincronizza i badge (possono essere sbloccati nuovi o revocati quelli esistenti).
     *
     * @param userId - ID dell'utente proprietario (prevenzione IDOR)
     * @param examId - ID dell'esame da aggiornare
     * @param examData - Dati completi dell'esame aggiornato
     * @returns Oggetto con nuovi badge sbloccati, badge revocati e differenza XP
     * @throws {Error} 'Esame non trovato o non autorizzato' se l'esame non esiste o non appartiene all'utente
     */
    async updateExam(userId: number, examId: number, examData: ExamUpdate) {
        const connection = await pool.getConnection();
        try {
            const { nome, voto, lode, cfu, data } = examData;

            const [oldExams] = await connection.query<RowDataPacket[]>(
                'SELECT xp_guadagnati FROM esami WHERE id = ? AND id_utente = ?',
                [examId, userId]
            );
            if (oldExams.length === 0) throw new Error('Esame non trovato o non autorizzato');

            const oldXp = oldExams[0].xp_guadagnati;
            let newXp = voto * cfu;
            if (lode) newXp += 50;
            const xpDifference = newXp - oldXp;

            await connection.beginTransaction();

            await connection.query(
                'UPDATE esami SET nome = ?, voto = ?, lode = ?, cfu = ?, data = ?, xp_guadagnati = ? WHERE id = ?',
                [nome, voto, lode || false, cfu, data, newXp, examId]
            );

            if (xpDifference !== 0) {
                await connection.query(
                    'UPDATE utenti SET xp_totali = xp_totali + ? WHERE id = ?',
                    [xpDifference, userId]
                );
            }

            const { newBadges, revokedBadgeIds } = await gamificationService.syncBadges(userId, connection);

            await connection.commit();
            return { newBadges, revokedBadgeIds, xpDifference };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    /**
     * Elimina un esame e decrementa gli XP totali dell'utente nella stessa transazione.
     * Sincronizza i badge dopo la rimozione (possono essere revocati badge ottenuti grazie a quell'esame).
     *
     * @param userId - ID dell'utente proprietario (prevenzione IDOR)
     * @param examId - ID dell'esame da eliminare
     * @throws {Error} 'Esame non trovato o non autorizzato' se l'esame non esiste o non appartiene all'utente
     */
    async deleteExam(userId: number, examId: number) {
        const connection = await pool.getConnection();
        try {
            const [exam] = await connection.query<RowDataPacket[]>(
                'SELECT xp_guadagnati FROM esami WHERE id = ? AND id_utente = ?',
                [examId, userId]
            );
            if (exam.length === 0) throw new Error('Esame non trovato o non autorizzato');

            const xpDaRimuovere = exam[0].xp_guadagnati;

            await connection.beginTransaction();
            await connection.query('DELETE FROM esami WHERE id = ?', [examId]);
            await connection.query(
                'UPDATE utenti SET xp_totali = xp_totali - ? WHERE id = ?',
                [xpDaRimuovere, userId]
            );

            await gamificationService.syncBadges(userId, connection);

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
};
