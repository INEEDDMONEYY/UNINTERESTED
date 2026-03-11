import express from "express";
import { createPromoCode, listPromoCodes } from "../controllers/promoCodeController.js";

const router = express.Router();

router.get("/", listPromoCodes);
router.post("/", createPromoCode);

export default router;