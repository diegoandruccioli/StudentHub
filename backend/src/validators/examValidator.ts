import { z } from 'zod';

export const examInputSchema = z.object({
  nome: z.string().min(1, 'Il nome dell\'esame è obbligatorio'),
  voto: z
    .number()
    .int('Il voto deve essere un numero intero')
    .min(18, 'Il voto minimo è 18')
    .max(30, 'Il voto massimo è 30'),
  lode: z.boolean(),
  cfu: z
    .number()
    .int('I CFU devono essere un numero intero')
    .positive('I CFU devono essere un numero positivo'),
  data: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La data deve essere nel formato YYYY-MM-DD'),
});

// L'update richiede tutti i campi (coerente con il tipo ExamUpdate nel service)
export const examUpdateSchema = examInputSchema;

// Lista di esami per l'endpoint di aggiunta (accetta array)
export const examListSchema = z
  .array(examInputSchema)
  .min(1, 'Fornire almeno un esame');

// Tipi TypeScript derivati automaticamente (no duplicazione)
export type ExamInput = z.infer<typeof examInputSchema>;
export type ExamUpdate = z.infer<typeof examUpdateSchema>;
