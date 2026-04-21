import { Request, Response, NextFunction } from 'express';
import { sendTokenResponse, verifyRefreshToken } from '../utils/jwt';
import { authService } from '../services/authService';
import { logger } from '../utils/logger';
import { registerSchema, loginSchema } from '../validators/authValidator';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: parsed.error.issues[0].message });
        }

        const user = await authService.register(parsed.data);
        const refreshToken = await authService.createRefreshToken(user.id);
        sendTokenResponse(user, 201, res, refreshToken);

    } catch (error) {
        if (error instanceof Error && error.message === 'Email già registrata') {
            return res.status(409).json({ message: error.message });
        }
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: parsed.error.issues[0].message });
        }

        const user = await authService.login(parsed.data);
        const refreshToken = await authService.createRefreshToken(user.id);
        sendTokenResponse(user, 200, res, refreshToken);

    } catch (error) {
        if (error instanceof Error && error.message === 'Credenziali non valide') {
            return res.status(401).json({ message: error.message });
        }
        next(error);
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    const token: string | undefined = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({ message: 'Refresh token mancante' });
    }

    try {
        // 1. Verifica firma JWT
        const decoded = verifyRefreshToken(token);

        // 2. Verifica presenza e validità nel DB (blacklist check)
        const storedToken = await authService.validateRefreshToken(token);
        if (!storedToken) {
            return res.status(401).json({ message: 'Refresh token non valido o scaduto' });
        }

        // 3. Ruota il refresh token (revoca il vecchio, genera il nuovo)
        await authService.revokeRefreshToken(token);
        const newRefreshToken = await authService.createRefreshToken(decoded.id);

        // 4. Genera e invia il nuovo access token
        const { generateAccessToken } = await import('../utils/jwt');
        const newAccessToken = generateAccessToken(decoded.id);

        const accessCookieOptions = {
            expires: new Date(Date.now() + 15 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const
        };

        const refreshCookieOptions = {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            path: '/api/auth/refresh'
        };

        res
            .cookie('token', newAccessToken, accessCookieOptions)
            .cookie('refreshToken', newRefreshToken, refreshCookieOptions)
            .json({ success: true });

    } catch {
        return res.status(401).json({ message: 'Refresh token non valido' });
    }
};

export const logout = async (req: Request, res: Response) => {
    const token: string | undefined = req.cookies.refreshToken;

    if (token) {
        await authService.revokeRefreshToken(token).catch(() => {});
    }

    res
        .cookie('token', '', { expires: new Date(0), httpOnly: true })
        .cookie('refreshToken', '', { expires: new Date(0), httpOnly: true, path: '/api/auth/refresh' })
        .status(200)
        .json({ success: true, message: 'Logout effettuato' });
};