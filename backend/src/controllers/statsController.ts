import { Request, Response } from 'express';
import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2';

export const getStats = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Non autenticato' });

        // Recupero degli esami ordinati per data (per grafico dell'andamento)
        const [exams] = await pool.query<RowDataPacket[]>(`
            SELECT nome, voto, cfu, data, lode 
            FROM esami 
            WHERE id_utente = ? 
            ORDER BY data ASC
        `, [req.user.id]);

        // Caso base: Studente senza esami
        if (exams.length === 0) {
            return res.json({
                 mediaAritmetica: 0,
                 mediaPonderata: 0,
                 baseLaurea: 0,
                 totaleCfu: 0,
                 chartData: { labels: [], data: [] }
            });
        }

        let sommaVoti = 0;
        let sommaPonderata = 0;
        let totaleCfu = 0;
        
        // Array per il grafico
        const labels: string[] = [];
        const dataPoints: number[] = [];

        // Itero sugli esami per i calcoli
        for (const exam of exams) {
            // Accumulatori per le medie
            sommaVoti += exam.voto;
            sommaPonderata += (exam.voto * exam.cfu);
            totaleCfu += exam.cfu;

            // Preparazione dati grafico (Asse X: Nome Esame o Data, Asse Y: Voto)
            labels.push(exam.nome); // Nome esame
            dataPoints.push(exam.voto); // Data esame
        }

        // Calcolo Medie e Proiezioni
        // toFixed(2) restituisce una stringa, quindi usiamo parseFloat per tornare a numero
        const mediaAritmetica = parseFloat((sommaVoti / exams.length).toFixed(2));
        const mediaPonderata = parseFloat((sommaPonderata / totaleCfu).toFixed(2));
        
        // Base di Laurea: (Media Ponderata * 110) / 30
        const baseLaurea = parseFloat(((mediaPonderata * 110) / 30).toFixed(2));

        res.json({
            mediaAritmetica,
            mediaPonderata,
            baseLaurea,
            totaleCfu,
            chartData: {
                labels,
                data: dataPoints
            }
        });

    } catch (error) {
        console.error('Errore calcolo stats:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
};