import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { User } from '../types/user';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Genera un access token JWT con scadenza breve (15 minuti).
 * Firmato con `JWT_ACCESS_SECRET`.
 *
 * @param id - ID dell'utente da includere nel payload
 * @returns Stringa JWT firmata
 */
export const generateAccessToken = (id: number): string => {
    return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET as string, {
        expiresIn: ACCESS_TOKEN_EXPIRY
    });
};

/**
 * Genera un refresh token JWT con scadenza lunga (7 giorni).
 * Non viene salvato in chiaro: viene hashato con SHA-256 prima della persistenza.
 * Firmato con `JWT_REFRESH_SECRET` (chiave separata dall'access token).
 *
 * @param id - ID dell'utente da includere nel payload
 * @returns Stringa JWT firmata
 */
export const generateRefreshToken = (id: number): string => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as string, {
        expiresIn: REFRESH_TOKEN_EXPIRY
    });
};

/**
 * Verifica la firma e la scadenza di un refresh token JWT.
 *
 * @param token - Il refresh token JWT ricevuto dal client
 * @returns Il payload decodificato (contiene almeno `id` e `iat`)
 * @throws {JsonWebTokenError} Se il token è malformato o la firma non corrisponde
 * @throws {TokenExpiredError} Se il token è scaduto
 */
export const verifyRefreshToken = (token: string): jwt.JwtPayload => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as jwt.JwtPayload;
};

/**
 * Calcola la data di scadenza per un nuovo refresh token (7 giorni da adesso).
 * Usata per il campo `expires_at` nella tabella `refresh_tokens`.
 *
 * @returns Oggetto `Date` con scadenza a 7 giorni
 */
export const getRefreshTokenExpiry = (): Date => {
    return new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
};

/**
 * Genera access + refresh token e li invia al client come cookie `httpOnly`.
 * Il cookie `token` (access) scade in 15 minuti; `refreshToken` in 7 giorni.
 * In produzione i cookie sono `secure: true`.
 *
 * @param user - Oggetto utente autenticato (id usato per generare i token)
 * @param statusCode - Codice HTTP della risposta (200 per login, 201 per register)
 * @param res - Oggetto risposta Express
 * @param refreshToken - Refresh token in chiaro già generato e persistito
 */
export const sendTokenResponse = (user: User, statusCode: number, res: Response, refreshToken: string): void => {
    const accessToken = generateAccessToken(user.id);

    const accessCookieOptions = {
        expires: new Date(Date.now() + 15 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const
    };

    const refreshCookieOptions = {
        expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        path: '/api/auth/refresh'
    };

    res.status(statusCode)
        .cookie('token', accessToken, accessCookieOptions)
        .cookie('refreshToken', refreshToken, refreshCookieOptions)
        .json({
            success: true,
            user: {
                id: user.id,
                nome: user.nome,
                cognome: user.cognome,
                email: user.email,
                ruolo: user.ruolo,
                xp_totali: user.xp_totali
            }
        });
};