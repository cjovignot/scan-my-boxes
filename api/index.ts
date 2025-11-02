import express from "express";
import cors from "cors";
import exampleRouter from "./routes/example.js";
import { connectDB } from "./utils/db.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/example", exampleRouter);
connectDB();

export default app; // 👈 Pas app.listen() !
