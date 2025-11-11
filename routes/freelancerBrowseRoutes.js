import express from "express";
import { getAllFreelancers, getFreelancerDetails } from "../controllers/freelancerController.js";

const router = express.Router();

router.get("/freelancers", getAllFreelancers);
router.get("/freelancers/:id", getFreelancerDetails);

export default router;
