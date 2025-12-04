import { JwtPayload } from 'jsonwebtoken';

// Definiamo l'interfaccia (senza password)
export interface UserPayload {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  ruolo: '0' | '1' | '2'; // '0'=Studente, '1'=Admin, '2'=SuperAdmin
  xp_totali: number;
}

// Modifica l'interfaccia Request di Express
declare global {
  namespace Express {
    interface Request {
      // (?) indica che l'utente potrebbe non essere presente
      user?: UserPayload; 
    }
  }
}