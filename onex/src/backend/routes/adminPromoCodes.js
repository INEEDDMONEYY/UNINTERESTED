import express from "express";
import {
	createPromoCode,
	listPromoCodes,
	redeemPromoCodeForUser,
} from "../controllers/promoCodeController.js";

const router = express.Router();

router.get("/", listPromoCodes);
router.post("/", createPromoCode);
router.post("/redeem", redeemPromoCodeForUser);

export default router;