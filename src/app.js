import express from "express";
import morgan from 'morgan';
import userRoute from './routes/user.routes.js';
import { connectDB } from "./config/db.connection.js";
import cookieParser from 'cookie-parser';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.use('/api/users', userRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
export default app;