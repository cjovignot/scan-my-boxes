import express from "express";
import cors from "cors";
import { connectDB } from "./utils/db.js";
import serverless from "serverless-http";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://scan-my-boxes-frontend.vercel.app/",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Vercel!" });
});

connectDB();

// 👇 C’est ça la différence : on exporte le handler
export const handler = serverless(app);
