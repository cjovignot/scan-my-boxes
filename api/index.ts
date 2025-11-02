import express from "express";
import cors from "cors";
import exampleRouter from "./routes/example.ts";
import { connectDB } from "./utils/db.ts";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/example", exampleRouter);

connectDB();

// ✅ Démarrage local seulement
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on http://localhost:${PORT}`);
  });
}

export default app;
