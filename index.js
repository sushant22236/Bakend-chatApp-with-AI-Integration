import {config} from './src/config/env.js';
import app from './src/app.js';
import http from 'http';  
import { Server } from 'socket.io';  

const server = http.createServer(app);

const io = new Server(server);
io.on('connection', socket => {

    console.log('a user connected');
  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => { /* … */ });
});


server.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});
