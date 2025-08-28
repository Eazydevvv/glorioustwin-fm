import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();


const uri = process.env.MONGODB_URI;


mongoose.connection.on('connected', () => console.log('MongoDB connected'));
mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));


await mongoose.connect(uri, {
    autoIndex: true
});