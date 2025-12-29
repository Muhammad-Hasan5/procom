import { Router } from "express";
import { rateLimiter } from "../middlewares/rateLimiter.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
	getNotifications,
	getUnreadCount,
	markAllAsRead,
	markAsRead,
} from "../controllers/notifications.controller";

const router = Router({ mergeParams: true });

router
	.route("/notificaitons")
	.get(rateLimiter, authMiddleware, getNotifications)
	.get(rateLimiter, authMiddleware, getUnreadCount);

router
	.route("/notifications/mark-read/:notification-id")
	.patch(rateLimiter, authMiddleware, markAsRead);

router
	.route("/notifications/mark-all-as-read")
	.patch(rateLimiter, authMiddleware, markAllAsRead);

export default router;
