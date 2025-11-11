import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createBooking,
  getBookings,
  getBookingById,
  acceptBooking,
  startWork,
  submitWork,
  approveWork,
  markPaid
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/bookings", authMiddleware, createBooking);
router.get("/bookings", authMiddleware, getBookings);
router.get("/bookings/:id", authMiddleware, getBookingById);
router.patch("/bookings/:id/accept", authMiddleware, acceptBooking);
router.patch("/bookings/:id/start", authMiddleware, startWork);
router.patch("/bookings/:id/submit", authMiddleware, submitWork);
router.patch("/bookings/:id/approve", authMiddleware, approveWork);
router.patch("/bookings/:id/mark-paid", authMiddleware, markPaid);

export default router;
