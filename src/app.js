import express from "express";
import morgan from 'morgan';
import userRoute from './routes/user.routes.js';
import { connectDB } from "./config/db.connection.js";

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/users', userRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
export default app;