import { Router } from "express";
import { User } from "../models/User";

const router = Router();

// ✅ GET - tous les utilisateurs
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("❌ Erreur récupération utilisateurs :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Champs requis manquants." });
    }

    const newUser = await User.create({ name, email, password });
    res.status(201).json({ message: "✅ Utilisateur créé", user: newUser });
  } catch (error) {
    console.error("Erreur création user:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
