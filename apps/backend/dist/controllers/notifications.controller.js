import { asyncHandler } from "../utils/async-handler";
import { ApiSuccessResponse } from "../utils/api-success-response";
import { Notification } from "../models/notifications.model";
import { ApiErrorResponse } from "../utils/api-error-response";
export const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({
        user: req.user?._id,
    }).sort({ createdAt: -1 });
    if (!notifications || notifications.length === 0) {
        return res
            .status(404)
            .json(new ApiErrorResponse(404, "Either no notfications or error fetching from DB"));
    }
    return res
        .status(200)
        .json(new ApiSuccessResponse(true, 200, "All notifications fetched in order", notifications));
});
export const markAsRead = asyncHandler(async (req, res) => {
    const readNotification = await Notification.findOneAndUpdate({
        _id: req.params._id,
        user: req.user?._id,
    }, { read: true });
    if (!readNotification) {
        return res
            .status(400)
            .json(new ApiErrorResponse(400, "Error markign notficaition as read"));
    }
    return res
        .status(200)
        .json(new ApiSuccessResponse(true, 200, "notification marked as read", readNotification));
});
export const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany({
        user: req.user?._id,
        read: false,
    }, { read: true });
    return res
        .status(200)
        .json(new ApiSuccessResponse(true, 200, "notification marked as read"));
});
export const getUnreadCount = asyncHandler(async (req, res) => {
    const count = await Notification.countDocuments({
        user: req.user?._id,
        read: false,
    });
    return res
        .status(200)
        .json(new ApiSuccessResponse(true, 200, "COunt fetched", { count }));
});
