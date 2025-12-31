import express from "express";
import morgan from 'morgan';
import userRoute from './routes/user.routes.js';
import projectRoute from './routes/project.routes.js';
import { connectDB } from "./config/db.connection.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.use('/api/users', userRoute);
app.use('/api/projects', projectRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
export default app;