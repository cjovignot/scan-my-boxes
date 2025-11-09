import { Router, Response } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { checkAdmin } from "../middlewares/checkAdmin";
import { AuthRequest } from "../middlewares/checkAuth";

const router = Router();

router.get(
  "/admin",
  checkAuth,
  checkAdmin,
  (req: AuthRequest, res: Response) => {
    res.json({
      message: "Bienvenue dans le panneau admin 🚀",
      user: req.user,
    });
  }
);

export default router;
