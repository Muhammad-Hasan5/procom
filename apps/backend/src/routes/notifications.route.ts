import { Router } from "express";
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
	.get(authMiddleware, getNotifications)
	.get(authMiddleware, getUnreadCount);

router
	.route("/notifications/mark-read/:notification-id")
	.patch(authMiddleware, markAsRead);

router
	.route("/notifications/mark-all-as-read")
	.patch(authMiddleware, markAllAsRead);

export default router;
