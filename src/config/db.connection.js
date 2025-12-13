import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async (req, res) => {
    try{
        await mongoose.connect(config.mongoURI)
            .then(() => {
                console.log('MongoDB connected successfully');
            })
    } catch(err){
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}