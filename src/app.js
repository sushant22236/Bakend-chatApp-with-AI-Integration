import express from "express";
import morgan from 'morgan';
const app = express();

app.use(morgan('dev'));
app.use(express.json());

import { connectDB } from "./config/db.connection.js";

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});
export default app;