import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { testConnection } from './src/config/db';
import { errorHandler } from './src/middleware/errorHandler';

// Import delle rotte
import authRoutes from './src/routes/authRoutes';
import examRoutes from './src/routes/examRoutes';
import settingsRoutes from './src/routes/settingsRoutes';
import userRoutes from './src/routes/userRoutes';
import statsRoutes from './src/routes/statsRoutes';
import gamificationRoutes from './src/routes/gamificationRoutes';
import adminRoutes from './src/routes/adminRoutes';
import { cleanupExpiredTokens } from './src/services/authService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Test DB
testConnection();

// Registrazione delle rotte
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint (usato dal Docker healthcheck)
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Root endpoint
app.get('/', (_req, res) => {
    res.send('API StudentHub is running...');
});

// Global error handler — deve stare DOPO tutte le route
app.use(errorHandler);

// Avvio server
app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);

    // Pulizia token scaduti: immediata all'avvio e poi ogni 24 ore
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    cleanupExpiredTokens().catch(() => {});
    setInterval(() => cleanupExpiredTokens().catch(() => {}), TWENTY_FOUR_HOURS);
});