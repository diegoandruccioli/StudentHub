import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { testConnection } from './src/config/db';
import authRoutes from './src/routes/authRoutes';
import examRoutes from './src/routes/examRoutes';
import settingsRoutes from './src/routes/settingsRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

testConnection();

// Definizione delle rotte API
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/', (req, res) => {
    res.send('API StudentHub is running...');
});

app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});