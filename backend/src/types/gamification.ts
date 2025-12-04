import { RowDataPacket } from 'mysql2';

export interface Livello extends RowDataPacket {
    numero: number;
    nome: string;
    xp_min: number;
    xp_max: number | null;
}

export interface ObiettivoSbloccato extends RowDataPacket {
    id_obiettivo: number;
    nome: string;
    descrizione: string;
    xp_valore: number;
    data_conseguimento: Date;
}
