const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = {
    error: (context: string, error: unknown): void => {
        const message = error instanceof Error ? error.message : String(error);
        if (isDevelopment) {
            console.error(`[ERROR] ${context}:`, error);
        } else {
            console.error(`[ERROR] ${context}: ${message}`);
        }
    },
    info: (message: string): void => {
        console.log(`[INFO] ${message}`);
    },
    warn: (message: string): void => {
        console.warn(`[WARN] ${message}`);
    }
};
