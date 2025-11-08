// ============================
// 🔐 routes/auth.ts
// ============================

import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  findUserByEmail,
  createUser,
  updateUserByEmail,
} from "../controllers/userController";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const router = Router();

// ✅ Client Google configuré avec l’ID côté backend
const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID!;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// ============================
// 🔹 POST /api/auth/google-login
// ============================
router.post("/google-login", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Token manquant." });
  }

  try {
    if (!GOOGLE_CLIENT_ID) {
      return res.status(500).json({ error: "Configuration Google manquante." });
    }

    // ✅ Vérifie le token Google côté serveur
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ error: "Email Google introuvable." });
    }

    // ⚙️ Valeurs sécurisées
    const email = payload.email;
    const name = payload.name ?? "Utilisateur Google";
    const picture = payload.picture ?? "";

    // 🔎 Recherche utilisateur existant
    let user = await findUserByEmail(email);

    if (!user) {
      console.log(`🆕 Création nouvel utilisateur Google : ${email}`);
      user = await createUser({
        name,
        email,
        picture,
        provider: "google",
        password: "-",
        role: "user", // rôle par défaut
      });
    } else {
      // ✅ Mise à jour sans écraser le rôle existant
      user = await updateUserByEmail(email, {
        name,
        picture,
        provider: "google",
      });
    }

    // 🔁 Réponse complète au front
    res.status(200).json({
      success: true,
      user: {
        _id: user!._id,
        name: user!.name,
        email: user!.email,
        picture: user!.picture,
        provider: user!.provider,
        role: user!.role, // 🟢 gardera bien "admin" si défini dans MongoDB
        createdAt: user!.createdAt,
        updatedAt: user!.updatedAt,
      },
    });
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
  const scope = ["openid", "email", "profile"].join(" ");

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    access_type: "offline",
    prompt: "select_account",
    scope,
  });

  console.log("🔁 Redirection Google OAuth →", params.toString());
  res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
});

// ============================
// 🔹 GET /api/auth/google-callback
// ============================
router.get("/google-callback", async (req, res) => {
  const code = req.query.code as string;

  if (!code) return res.status(400).json({ error: "Code manquant." });

  try {
    // Échange le code contre un token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokens.id_token) throw new Error("Pas d'id_token reçu de Google");

    // Vérifie le token côté serveur
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ error: "Email manquant dans le token." });
    }

    // ⚙️ Valeurs sécurisées
    const email = payload.email;
    const name = payload.name ?? "Utilisateur Google";
    const picture = payload.picture ?? "";

    let user = await findUserByEmail(email);
    if (!user) {
      user = await createUser({
        name,
        email,
        picture,
        provider: "google",
        password: "-",
      });
    }

    const frontendUrl =
      process.env.FRONTEND_URL || "https://scan-my-boxes.vercel.app";

    res.redirect(
      `${frontendUrl}/auth/success?email=${encodeURIComponent(email)}`
    );
  } catch (err: any) {
    console.error("❌ Erreur callback Google:", err);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
});

// ============================
// 🔹 POST /api/auth/login
// ============================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis." });
  }

  try {
    // 🔍 Recherche de l'utilisateur
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable." });
    }

    // ⚙️ Vérifie que ce n’est pas un compte Google
    if (user.provider === "google") {
      return res.status(400).json({
        error: "Ce compte est associé à Google. Utilisez la connexion Google.",
      });
    }

    // 🧩 Vérifie le mot de passe
    const bcrypt = await import("bcryptjs");
    if (!user.password) {
      return res.status(400).json({
        error: "Ce compte ne possède pas de mot de passe local.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Mot de passe incorrect." });
    }

    // 🔐 Génère le token JWT
    const jwt = await import("jsonwebtoken");
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // 🔁 Redirige vers /auth/success sur le frontend (même logique que Google)
    const frontendUrl =
      process.env.FRONTEND_URL || "https://scan-my-boxes.vercel.app";

    const redirectUrl = `${frontendUrl}/auth/success?email=${encodeURIComponent(
      email
    )}&token=${token}`;

    console.log("✅ Redirection vers :", redirectUrl);
    return res.redirect(redirectUrl);
  } catch (error: any) {
    console.error("❌ Erreur login :", error);
    res.status(500).json({
      error: "Erreur lors de la connexion",
      details: error.message,
    });
  }
});

export default router;
