import express from "express";
import { Box } from "../models/Box";
import { Types } from "mongoose";
import QRCode from "qrcode";
import cloudinary from "cloudinary";
import { Storage } from "models/Storage";
import { updateStorageById } from "../controllers/storageController";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const router = express.Router();

/**
 * 🟢 GET /api/boxes
 * Liste toutes les boîtes (possibilité de filtrer par ownerId ou storageId)
 */
router.get("/", async (req, res) => {
  try {
    const { ownerId, storageId } = req.query;

    const filter: any = {};

    if (ownerId) {
      // ✅ Cast auto vers ObjectId si possible
      filter.ownerId = Types.ObjectId.isValid(ownerId)
        ? new Types.ObjectId(ownerId as string)
        : ownerId;
    }

    if (storageId) {
      filter.storageId = Types.ObjectId.isValid(storageId)
        ? new Types.ObjectId(storageId as string)
        : storageId;
    }

    const boxes = await Box.find(filter).sort({ createdAt: -1 });
    res.json(boxes);
  } catch (err) {
    console.error("Erreur lors de la récupération des boîtes :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * 🟢 POST /api/boxes
 * Crée une nouvelle boîte (numéro auto + QR code Cloudinary)
 */
router.post("/", async (req, res) => {
  try {
    const { ownerId, storageId, destination, content, dimensions } = req.body;

    if (!ownerId || !storageId) {
      return res
        .status(400)
        .json({ error: "ownerId et storageId sont requis" });
    }

    // ✅ Cast propre vers ObjectId pour cohérence avec la base
    const ownerObjectId = Types.ObjectId.isValid(ownerId)
      ? new Types.ObjectId(ownerId)
      : ownerId;

    const storageObjectId = Types.ObjectId.isValid(storageId)
      ? new Types.ObjectId(storageId)
      : storageId;

    // 🔢 Génère un numéro unique basé sur le nombre de boîtes du user
    const userBoxes = await Box.find({ ownerId: ownerObjectId }).sort({
      createdAt: 1,
    });
    const nextNumber = (userBoxes.length + 1).toString().padStart(3, "0");
    const boxNumber = `BOX-${nextNumber}`;

    // 🗃️ Création de la nouvelle boîte
    const newBox = new Box({
      ownerId: ownerObjectId,
      storageId: storageObjectId,
      number: boxNumber,
      destination: destination || "Inconnu",
      content: content || [],
      dimensions: {
        width: dimensions?.width || 0,
        height: dimensions?.height || 0,
        depth: dimensions?.depth || 0,
      },
    });

    // 💾 Enregistre la boîte
    const savedBox = await newBox.save();

    // 🔗 Ajoute la boîte à l'entrepôt correspondant
    const updatedStorage = await updateStorageById(storageObjectId.toString(), {
      $addToSet: { boxes: savedBox._id },
    });

    if (!updatedStorage) {
      console.warn("⚠️ Entrepôt introuvable pour ajout de boîte");
    }

    // 🧾 Génère un QR code avec l’URL publique de la boîte
    const boxURL = `${
      process.env.FRONTEND_URL || "https://scanmyboxes.app"
    }/box/${savedBox._id}`;
    const qrCodeDataURL = await QRCode.toDataURL(boxURL);

    // ☁️ Upload du QR code sur Cloudinary
    const uploadResponse = await cloudinary.v2.uploader.upload(qrCodeDataURL, {
      folder: "scan-my-boxes/qrcodes",
      public_id: `qrcode_${savedBox._id}`,
      overwrite: true,
    });

    // 🧩 Met à jour la boîte avec l’URL du QR code
    savedBox.qrcodeURL = uploadResponse.secure_url;
    await savedBox.save();

    res.status(201).json(savedBox);
  } catch (err) {
    console.error("Erreur création boîte :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;