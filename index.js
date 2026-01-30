import {config} from './src/config/env.js';
import app from './src/app.js';
import http from 'http';  
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'; 
import mongoose from 'mongoose'; 
import projectModel from './src/models/project.model.js';
import { send } from 'process';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    orgin: '*'
  }
});

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];

        const projectId = socket.handshake.query?.projectId;

        if(!mongoose.Types.ObjectId.isValid(projectId)) {
            throw new Error('Invalid project ID');
        }

        socket.project = await projectModel.findById(projectId);

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
  socket.join(socket.project._id.toString());

  socket.on('project-message', data => {

    const message = data.message;

    const aiIsPresentInMessage = message.includes('@AI');

    if(aiIsPresentInMessage){
        socket.emit('project-message', {
            sender: data.sender,
            message: "Ai is present in the message"
        })
        return;
    }

    socket.broadcast.to(socket.project._id.toString()).emit('project-message', data);
  })
  
  socket.on('disconnect', () => { 
    console.log('user disconnected');
    socket.leave(socket.project._id.toString());

   });
});


server.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});
