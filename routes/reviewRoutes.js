import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createReview, getFreelancerReviews } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/reviews", authMiddleware, createReview);
router.get("/reviews/:freelancerId", getFreelancerReviews);

export default router;
