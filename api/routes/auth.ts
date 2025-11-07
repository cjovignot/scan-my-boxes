// ============================
// 🔐 routes/auth.ts
// ============================

import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import { connectDB } from "../utils/db";
import { User } from "../models/User";
import dotenv from "dotenv";
import path from "path";

// ✅ Charge les variables d’environnement locales si besoin
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const router = Router();

// ✅ Client Google configuré avec l’ID côté backend
const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// ============================
// 🔹 POST /api/auth/google-login
// ============================
router.post("/google-login", async (req, res) => {
  await connectDB();

  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Token manquant." });
  }

  try {
    if (!GOOGLE_CLIENT_ID) {
      console.error("❌ GOOGLE_CLIENT_ID non défini dans le backend");
      return res.status(500).json({ error: "Configuration Google manquante." });
    }

    // ✅ Vérifie la validité du token Google côté serveur
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({ error: "Email Google introuvable." });
    }

    const { email, name, picture } = payload;

    // ✅ Recherche l'utilisateur ou création si nouveau
    let user = await User.findOne({ email });
    if (!user) {
      console.log(`🆕 Nouvel utilisateur Google : ${email}`);

      user = await User.create({
        name,
        email,
        picture,
        provider: "google",
        password: "-", // placeholder pour satisfaire le schéma Mongoose
      });
    } else {
      // ✅ Mise à jour des infos existantes
      user.name = name || user.name;
      user.picture = picture || user.picture;
      user.provider = "google";
      await user.save();
    }

    console.log(`✅ Connexion Google réussie pour : ${email}`);

    res.status(200).json({ success: true, user });
  } catch (error: any) {
    console.error("❌ Erreur Google Login :", error);
    res.status(400).json({
      error: "Erreur d'authentification Google",
      details: error.message,
    });
  }
});

// ============================
// 🔹 GET /api/auth/google-redirect
// ============================
router.get("/google-redirect", (req, res) => {
  const redirect_uri =
    process.env.GOOGLE_REDIRECT_URI ||
    "https://ton-domaine.vercel.app/api/auth/google-callback";
  const scope = ["openid", "email", "profile"].join(" ");

  const params = new URLSearchParams({
    client_id: process.env.VITE_GOOGLE_CLIENT_ID!,
    redirect_uri,
    response_type: "code",
    access_type: "offline",
    prompt: "select_account",
    scope,
  });

  res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
});

// ============================
// 🔹 GET /api/auth/google-callback
// ============================
router.get("/google-callback", async (req, res) => {
  await connectDB();
  const code = req.query.code as string;

  if (!code) return res.status(400).json({ error: "Code manquant." });

  try {
    // Échange le code contre un token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.VITE_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokens.id_token) throw new Error("Pas d'id_token reçu de Google");

    // Vérifie le token côté serveur (comme tu fais déjà)
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ error: "Email manquant dans le token." });
    }

    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        picture,
        provider: "google",
        password: "-",
      });
    }

    const frontendUrl =
      process.env.FRONTEND_URL || "https://ton-domaine.vercel.app";
    // 🔁 Redirige vers le frontend avec un paramètre user/token
    res.redirect(`${frontendUrl}/auth/success?email=${email}`);
  } catch (err: any) {
    console.error("❌ Erreur callback Google:", err);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
});

export default router;
