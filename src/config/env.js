import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 7000,
    mongoURI: process.env.mongoURI || " ", 
}