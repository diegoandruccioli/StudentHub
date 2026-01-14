import { pool } from '../config/db';
import bcrypt from 'bcrypt';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { UserRole } from '../types/enums';
import { User } from '../types/user';

export const authService = {
    async register(userData: any) {
        const { nome, cognome, email, password } = userData;

        const [existingUsers] = await pool.query<RowDataPacket[]>(`
            SELECT * FROM utenti WHERE email = ?
        `, [email]);

        if (existingUsers.length > 0) {
            throw new Error('Email già registrata');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.query<ResultSetHeader>(`
            INSERT INTO utenti (nome, cognome, email, password) 
            VALUES (?, ?, ?, ?)
        `, [nome, cognome, email, hashedPassword]);

        const newUserId = result.insertId;

        // Inizializza impostazioni di default (IGNORE se esiste già)
        await pool.query(`
            INSERT IGNORE INTO impostazioni_utente (id_utente) VALUES (?)
        `, [newUserId]);

        const user: User = {
            id: newUserId,
            nome,
            cognome,
            email,
            ruolo: UserRole.STUDENT,
            xp_totali: 0
        };

        return user;
    },

    async login(loginData: any): Promise<User> {
        const { email, password } = loginData;
        const [users] = await pool.query<RowDataPacket[]>(`SELECT * FROM utenti WHERE email = ?`, [email]);
        const user = users[0];
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Credenziali non valide');
        }
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
    }
};
