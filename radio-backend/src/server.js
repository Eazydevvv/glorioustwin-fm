import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';


import './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import routes from './routes/index.js';


dotenv.config();
const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));


// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '../..', 'uploads')));


// Routes
app.use('/api', routes);


// Health check
app.get('/', (_req, res) => {
res.json({ status: 'ok', service: 'radio-backend' });
});


// Error handler
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));