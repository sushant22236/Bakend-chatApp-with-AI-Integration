import express from "express";
const app = express();

import { connectDB } from "./config/db.connection.js";

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});
export default app;