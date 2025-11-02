import { Router } from "express";
import { Example } from "../models/Example";

const router = Router();

// ✅ GET - simple test route
router.get("/", (req, res) => {
  res.json({ message: "Hello from serverless API!" });
});

// ✅ POST - create a new document
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Le champ 'name' est requis." });
    }

    const newDoc = await Example.create({ name, description });
    res.status(201).json({
      message: "✅ Document créé avec succès !",
      document: newDoc,
    });
  } catch (error) {
    console.error("❌ Erreur MongoDB:", error);
    res.status(500).json({ error: "Erreur serveur lors de la création." });
  }
});

export default router;
