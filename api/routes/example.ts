import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello from serverless API!" });
});

export default router;
