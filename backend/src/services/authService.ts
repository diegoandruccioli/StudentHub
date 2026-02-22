import { pool } from '../config/db';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { UserRole } from '../types/enums';
import { User } from '../types/user';
import { generateRefreshToken, getRefreshTokenExpiry } from '../utils/jwt';

const hashToken = (token: string): string =>
    crypto.createHash('sha256').update(token).digest('hex');

export const authService = {
    /**
     * Registra un nuovo utente nel sistema.
     * Crea automaticamente le impostazioni default per il nuovo account.
     *
     * @param userData - Dati dell'utente da registrare
     * @param userData.nome - Nome dell'utente
     * @param userData.cognome - Cognome dell'utente
     * @param userData.email - Email univoca (verrà verificata)
     * @param userData.password - Password in chiaro (verrà hashata con bcrypt)
     * @returns Oggetto utente appena creato, senza campi sensibili
     * @throws {Error} 'Email già registrata' se l'email è già presente nel database
     */
    async register(userData: { nome: string; cognome: string; email: string; password: string }) {
        const { nome, cognome, email, password } = userData;

        const [existingUsers] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM utenti WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            throw new Error('Email già registrata');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO utenti (nome, cognome, email, password) VALUES (?, ?, ?, ?)',
            [nome, cognome, email, hashedPassword]
        );

        const newUserId = result.insertId;

        await pool.query(
            'INSERT IGNORE INTO impostazioni_utente (id_utente) VALUES (?)',
            [newUserId]
        );

        const user: User = { id: newUserId, nome, cognome, email, ruolo: UserRole.STUDENT, xp_totali: 0 };
        return user;
    },

    /**
     * Autentica un utente tramite email e password.
     *
     * @param loginData - Credenziali di accesso
     * @param loginData.email - Email dell'utente
     * @param loginData.password - Password in chiaro (confrontata con bcrypt)
     * @returns Oggetto utente autenticato, senza il campo password
     * @throws {Error} 'Credenziali non valide' se email o password non corrispondono
     */
    async login(loginData: { email: string; password: string }): Promise<User> {
        const { email, password } = loginData;
        const [users] = await pool.query<RowDataPacket[]>(
            'SELECT id, nome, cognome, email, password, ruolo, xp_totali FROM utenti WHERE email = ?',
            [email]
        );
        const user = users[0];
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Credenziali non valide');
        }
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
    },

    /**
     * Genera un refresh token JWT, lo hasha con SHA-256 e lo persiste nel database.
     * Il token viene ruotato ad ogni utilizzo per prevenire il riuso.
     *
     * @param userId - ID dell'utente a cui associare il token
     * @returns Il refresh token in chiaro (da inviare al client via cookie httpOnly)
     */
    async createRefreshToken(userId: number): Promise<string> {
        const refreshToken = generateRefreshToken(userId);
        const tokenHash = hashToken(refreshToken);
        const expiresAt = getRefreshTokenExpiry();

        await pool.query(
            'INSERT INTO refresh_tokens (id_utente, token_hash, expires_at) VALUES (?, ?, ?)',
            [userId, tokenHash, expiresAt]
        );

        return refreshToken;
    },

    /**
     * Valida un refresh token verificando che esista nel database e non sia scaduto.
     * Funziona come blacklist implicita: i token revocati vengono eliminati dal DB.
     *
     * @param token - Il refresh token in chiaro ricevuto dal client
     * @returns La riga del database se il token è valido, `null` altrimenti
     */
    async validateRefreshToken(token: string): Promise<RowDataPacket | null> {
        const tokenHash = hashToken(token);
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM refresh_tokens WHERE token_hash = ? AND expires_at > NOW()',
            [tokenHash]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Revoca (invalida) un singolo refresh token eliminandolo dal database.
     * Usato durante la rotazione del token e il logout.
     *
     * @param token - Il refresh token in chiaro da revocare
     */
    async revokeRefreshToken(token: string): Promise<void> {
        const tokenHash = hashToken(token);
        await pool.query('DELETE FROM refresh_tokens WHERE token_hash = ?', [tokenHash]);
    },

    /**
     * Revoca tutti i refresh token attivi di un utente.
     * Utilizzato per implementare il logout globale (es. cambio password, account compromesso).
     *
     * @param userId - ID dell'utente di cui revocare tutti i token
     */
    async revokeAllUserRefreshTokens(userId: number): Promise<void> {
        await pool.query('DELETE FROM refresh_tokens WHERE id_utente = ?', [userId]);
    }
};

/**
 * Elimina dal database tutti i refresh token con `expires_at` nel passato.
 * Schedulato all'avvio del server e ogni 24 ore per mantenere pulita la tabella.
 */
export async function cleanupExpiredTokens(): Promise<void> {
    await pool.query('DELETE FROM refresh_tokens WHERE expires_at < NOW()');
}
