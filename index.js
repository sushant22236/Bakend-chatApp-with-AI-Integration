import {config} from './src/config/env.js';
import app from './src/app.js';
import http from 'http';  
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'; 
import mongoose from 'mongoose'; 
import projectModel from './src/models/project.model.js';
import { send } from 'process';
import { generateAIResponse } from './src/services/ai.service.js';

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

  socket.on('project-message', async data => {

    const message = data.message;

    const aiIsPresentInMessage = message.includes('@AI');

    if(aiIsPresentInMessage){

        const prompt = message.replace('@AI', '')

        const result = await generateAIResponse(prompt);

        io.to(socket.project._id.toString()).emit('project-message', { 
            message: result, 
            sender: {
                _id: 'AI',
                name: 'AI Assistant'
            }
        });

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
