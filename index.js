import {config} from './src/config/env.js';
import app from './src/app.js';
import http from 'http';  
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';  

const server = http.createServer(app);
const io = new Server(server);

io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];

        if(!token) {
            throw new Error('Authentication error: Token not provided');
        }

        const decoded = jwt.verify(token, config.Jwt_secret);

        if (!decoded) {
            throw new Error('Authentication error: Invalid token');
        }

        socket.user = decoded;
        next();
    } catch (err) {
        next(err);
    }
});

io.on('connection', socket => {

    console.log('a user connected');
  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => { /* … */ });
});


server.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});
