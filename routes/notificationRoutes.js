import express from "express";
import { getUserNotifications, markAsRead, markAllAsRead, getUnreadCount } from "../controllers/notificationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/notifications", authMiddleware, getUserNotifications);
router.get("/notifications/unread-count", authMiddleware, getUnreadCount);
router.patch("/notifications/:id/read", authMiddleware, markAsRead);
router.patch("/notifications/mark-all-read", authMiddleware, markAllAsRead);

export default router;
