import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 7000,
    mongoURI: process.env.mongoURI || " ", 
    Jwt_secret: process.env.JWT_SECRET || " ",
    redis: {
        host: process.env.REDIS_HOST || " ",
        port: process.env.REDIS_PORT || " ",
        password: process.env.REDIS_PASSWORD || " "
    }
}