import { asyncHandler } from "../utils/async-handler";
import { ApiSuccessResponse } from "../utils/api-success-response";
import { Notification } from "../models/notifications.model";
import { Request, Response } from "express";
import { NotificationDocument } from "../types/NotificationsModel.types";
import { ApiErrorResponse } from "../utils/api-error-response";
import {
	getNotificationsListCache,
	invalidateNotificationsListCache,
	setNotificationsListCache,
} from "../cache/notifications/notifications.cache";
import { Types } from "mongoose";

export const getNotifications = asyncHandler(
	async (req: Request, res: Response) => {
		const cached = await getNotificationsListCache(
			req.user?._id as Types.ObjectId,
		);

		if (cached) {
			return res
				.status(200)
				.json(
					new ApiSuccessResponse<object>(
						true,
						200,
						"notifications fetched",
						JSON.parse(cached),
					),
				);
		}

		const notifications = await Notification.find({
			user: req.user?._id,
		}).sort({ createdAt: -1 });

		if (!notifications || notifications.length === 0) {
			return res
				.status(404)
				.json(
					new ApiErrorResponse(
						404,
						"Either no notfications or error fetching from DB",
					),
				);
		}

		await setNotificationsListCache(
			req.user?._id as Types.ObjectId,
			notifications,
		);

		return res
			.status(200)
			.json(
				new ApiSuccessResponse<NotificationDocument[]>(
					true,
					200,
					"All notifications fetched in order",
					notifications,
				),
			);
	},
);

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
	const readNotification = await Notification.findOneAndUpdate(
		{
			_id: req.params._id,
			user: req.user?._id,
		},
		{ read: true },
	);

	if (!readNotification) {
		return res
			.status(400)
			.json(
				new ApiErrorResponse(400, "Error markign notficaition as read"),
			);
	}

	await invalidateNotificationsListCache(req.user?._id as Types.ObjectId);

	return res
		.status(200)
		.json(
			new ApiSuccessResponse<NotificationDocument>(
				true,
				200,
				"notification marked as read",
				readNotification,
			),
		);
});

export const markAllAsRead = asyncHandler(
	async (req: Request, res: Response) => {
		await Notification.updateMany(
			{
				user: req.user?._id,
				read: false,
			},
			{ read: true },
		);

		await invalidateNotificationsListCache(req.user?._id as Types.ObjectId);

		return res
			.status(200)
			.json(
				new ApiSuccessResponse(
					true,
					200,
					"notification marked as read",
				),
			);
	},
);

export const getUnreadCount = asyncHandler(
	async (req: Request, res: Response) => {
		const count = await Notification.countDocuments({
			user: req.user?._id,
			read: false,
		});

		return res
			.status(200)
			.json(
				new ApiSuccessResponse<{ count: number }>(
					true,
					200,
					"COunt fetched",
					{ count },
				),
			);
	},
);
