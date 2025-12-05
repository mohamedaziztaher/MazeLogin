import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes (to be added)
import authRoutes from './routes/authRoutes';

app.get('/', (req, res) => {
    res.send('MazeID API is running');
});

app.use('/api/auth', authRoutes);

export default app;
