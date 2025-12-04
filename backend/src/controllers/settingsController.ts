import { Request, Response } from 'express';
import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2';

// GET: Impostazioni
export const getSettings = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Non autenticato' });

        const [settings] = await pool.query<RowDataPacket[]>(
            'SELECT tema_voti, rgb_soglia_bassa, rgb_soglia_alta FROM impostazioni_utente WHERE id_utente = ?', 
            [req.user.id]
        );

        if (settings.length === 0) {
            return res.status(404).json({ message: 'Impostazioni non trovate' });
        }

        res.json(settings[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore nel recupero impostazioni' });
    }
};

// PUT: Aggiorna impostazioni
export const updateSettings = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Non autenticato' });

        const { tema_voti, rgb_soglia_bassa, rgb_soglia_alta } = req.body;

        if (!tema_voti) {
            return res.status(400).json({ message: 'Il tema è obbligatorio' });
        }

        if (tema_voti === 'RGB') {
            if (rgb_soglia_bassa > rgb_soglia_alta) {
                return res.status(400).json({ message: 'La soglia bassa non può essere maggiore di quella alta' });
            }
            if (rgb_soglia_bassa < 18 || rgb_soglia_alta > 30) {
                return res.status(400).json({ message: 'Le soglie devono essere tra 18 e 30' });
            }
        }

        await pool.query(
            'UPDATE impostazioni_utente SET tema_voti = ?, rgb_soglia_bassa = ?, rgb_soglia_alta = ? WHERE id_utente = ?',
            [tema_voti, rgb_soglia_bassa, rgb_soglia_alta, req.user.id]
        );

        res.json({ 
            message: 'Impostazioni aggiornate con successo',
            settings: { tema_voti, rgb_soglia_bassa, rgb_soglia_alta }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore aggiornamento impostazioni' });
    }
};