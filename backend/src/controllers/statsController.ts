import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2';

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Non autenticato' });

        const [exams] = await pool.query<RowDataPacket[]>(`
            SELECT nome, voto, cfu, data, lode 
            FROM esami 
            WHERE id_utente = ? 
            ORDER BY data ASC
        `, [req.user.id]);

        if (exams.length === 0) {
            return res.json({
                 mediaAritmetica: 0,
                 mediaPonderata: 0,
                 baseLaurea: 0,
                 totaleCfu: 0,
                 chartData: { labels: [], data: [], examNames: [] }
            });
        }

        let sommaVoti = 0;
        let sommaPonderata = 0;
        let totaleCfu = 0;
        
        const labels: string[] = [];
        const dataPoints: number[] = [];
        const examNames: string[] = [];

        const mesi = ['GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'];

        for (const exam of exams) {
            sommaVoti += exam.voto;
            sommaPonderata += (exam.voto * exam.cfu);
            totaleCfu += exam.cfu;

            const d = new Date(exam.data);
            const giorno = d.getDate();
            const mese = mesi[d.getMonth()];
            
            labels.push(`${giorno} ${mese}`); 
            dataPoints.push(exam.voto);
            examNames.push(exam.nome);
        }

        const mediaAritmetica = parseFloat((sommaVoti / exams.length).toFixed(2));
        const mediaPonderata = parseFloat((sommaPonderata / totaleCfu).toFixed(2));
        const baseLaurea = parseFloat(((mediaPonderata * 110) / 30).toFixed(2));

        res.json({
            mediaAritmetica,
            mediaPonderata,
            baseLaurea,
            totaleCfu,
            chartData: {
                labels, 
                data: dataPoints,
                examNames
            }
        });

    } catch (error) {
        next(error);
    }
};