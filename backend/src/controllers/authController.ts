import { Request, Response } from 'express';
import { pool } from '../config/db';
import bcrypt from 'bcrypt';
import { sendTokenResponse } from '../utils/jwt';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// --- REGISTRAZIONE ---
export const register = async (req: Request, res: Response) => {
    try {
        const { nome, cognome, email, password } = req.body;

        if (!nome || !cognome || !email || !password) {
            return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
        }

        const [existingUsers] = await pool.query<RowDataPacket[]>('SELECT * FROM utenti WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Email già registrata' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO utenti (nome, cognome, email, password) VALUES (?, ?, ?, ?)',
            [nome, cognome, email, hashedPassword]
        );

        const user = {
            id: result.insertId,
            nome,
            cognome,
            email,
            ruolo: '0',
            xp_totali: 0
        };

        sendTokenResponse(user, 201, res);

    } catch (error) {
        console.error('Errore register:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
};

// --- LOGIN ---
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Inserisci email e password' });
        }

        const [users] = await pool.query<RowDataPacket[]>('SELECT * FROM utenti WHERE email = ?', [email]);
        const user = users[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Credenziali non valide' });
        }

        sendTokenResponse(user, 200, res);

    } catch (error) {
        console.error('Errore login:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
};

// --- LOGOUT ---
export const logout = (req: Request, res: Response) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ success: true, message: 'Logout effettuato' });
};