import Redis from 'ioredis';
import { config } from '../config/env.js';

const redisClient = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
});

redisClient.on('connect', () => {
    console.log('Connected to Redis server');
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

export default redisClient;