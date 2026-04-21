import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

const createRateLimiter = (maxRequests: number, windowMinutes: number, message: string) =>
    rateLimit({
        windowMs: windowMinutes * 60 * 1000,
        max: maxRequests,
        standardHeaders: true,
        legacyHeaders: false,
        message: { message }
    });

export const loginLimiter = createRateLimiter(
    10, 15,
    'Troppi tentativi di login. Riprova tra 15 minuti.'
);

export const registerLimiter = createRateLimiter(
    5, 60,
    'Troppi tentativi di registrazione. Riprova tra 60 minuti.'
);

export const refreshLimiter = createRateLimiter(
    20, 15,
    'Troppe richieste di refresh. Riprova tra 15 minuti.'
);
