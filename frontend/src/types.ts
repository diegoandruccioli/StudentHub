export interface User {
  id: number | string;
  email: string;
  nome: string;
  cognome: string;
  ruolo: string;
  xp_totali?: number;
  created_at?: string;
}

export interface RegisterPayload {
  nome: string;
  cognome: string;
  email: string;
  password: string;
}

export interface Exam {
  id: number | string;
  nome: string;
  voto: number;
  cfu: number;
  lode: boolean;
  data: string;
  user_id?: number | string;
}

export interface GamificationStatus {
  xp_totali: number;
  livello: {
    numero: number;
    nome: string;
  };
  progress: {
    percentuale: number;
    xp_mancanti: number;
    prossima_soglia: number;
  };
}

export interface Badge {
  id: number | string;
  nome: string;
  descrizione: string;
  xp_valore: number;
  icona?: string;
  sbloccato?: boolean;
}

export interface MyBadge {
  id_obiettivo: number;
}

// Alias usato in ObjectivesPage per chiarezza di lettura
export type MyBadgeResponse = MyBadge;

export interface PaginatedMeta {
  totalItems: number;
  totalStudents: number;
  totalAdmins: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface StatsResponse {
  mediaPonderata: number;
  totaleCfu: number;
  baseLaurea: number;
  chartData: {
    labels: string[];
    data: number[];
    examNames: string[];
  };
}

export interface ExamPayload {
  nome: string;
  voto: number;
  lode: boolean;
  cfu: number;
  data: string;
}
