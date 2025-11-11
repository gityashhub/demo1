import express from "express";
import { createPricingPackage, getPricingPackages, updatePricingPackage, deletePricingPackage } from "../controllers/pricingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/pricing/create-package", authMiddleware, createPricingPackage);
router.get("/pricing/packages/:freelancerId", getPricingPackages);
router.put("/pricing/update-package/:id", authMiddleware, updatePricingPackage);
router.delete("/pricing/delete-package/:id", authMiddleware, deletePricingPackage);

export default router;
