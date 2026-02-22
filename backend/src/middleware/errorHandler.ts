import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Errore applicativo con status HTTP esplicito.
 * Lanciarlo dai service garantisce che il errorHandler
 * risponda con il codice corretto senza logica duplicata nei controller.
 */
export class AppError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
    // Mantiene lo stack trace corretto in V8
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware Express global error handler (4 argomenti obbligatori).
 * Deve essere registrato DOPO tutte le route in server.ts.
 *
 * Gestisce:
 * - AppError  → risponde con statusCode e message dell'errore
 * - Qualsiasi altro errore → log + 500 generico (nessun dettaglio al client)
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  // Errore non previsto: logga i dettagli internamente, non esporli al client
  logger.error('Unhandled error', err);
  res.status(500).json({ message: 'Errore interno del server' });
}
