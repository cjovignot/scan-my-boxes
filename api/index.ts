import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import exampleRouter from "./routes/example";
import { connectDB } from "./utils/db";
import "dotenv/config";

const app = express();

// ✅ Liste blanche des origines autorisées
const allowedOrigins = [
  "http://localhost:5173",
  "https://scan-my-boxes.vercel.app",
];

// ✅ Middleware CORS manuel pour compatibilité Vercel
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// ✅ (optionnel) tu peux aussi laisser cors() pour le dev local
app.use(cors());

app.use(express.json());
app.use("/api/example", exampleRouter);

connectDB();

// ✅ Démarrage local uniquement
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 API running locally on http://localhost:${PORT}`);
  });
}

export default app;
