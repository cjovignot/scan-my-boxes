import { Router } from "express";
import { User } from "../models/User";
import { connectDB } from "../utils/db";

const router = Router();
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

router.post("/social-login", async (req, res) => {
  await connectDB();
  try {
    const { provider, token } = req.body;

    if (provider !== "google" || !token)
      return res.status(400).json({ error: "Données invalides." });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email)
      return res.status(400).json({ error: "Email Google manquant." });

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        password: "-", // inutile pour Google login
        provider: "google",
      });
    }

    res.json({ message: "✅ Login Google réussi", user });
  } catch (err) {
    console.error("❌ Erreur social-login:", err);
    res.status(401).json({ error: "Token Google invalide." });
  }
});

export default router;
