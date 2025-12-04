import jwt from 'jsonwebtoken';
import { Response } from 'express';

const generateToken = (id: number): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d'
    });
};

export const sendTokenResponse = (user: any, statusCode: number, res: Response): void => {
    const token = generateToken(user.id);

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const
    };

    res.status(statusCode)
        .cookie('token', token, options)
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