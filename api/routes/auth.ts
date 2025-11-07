import type { VercelRequest, VercelResponse } from "@vercel/node";
import { OAuth2Client } from "google-auth-library";
import connectDB from "../../utils/db";
import { User } from "../../models/User";

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Méthode non autorisée" });

  await connectDB();

  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Token manquant" });

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ message: "Token invalide" });

    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) user = await User.create({ name, email, avatar: picture });

    return res.status(200).json({ user });
  } catch (error: any) {
    console.error("Erreur Google Login:", error);
    return res.status(400).json({ message: "Erreur d'authentification Google" });
  }
}