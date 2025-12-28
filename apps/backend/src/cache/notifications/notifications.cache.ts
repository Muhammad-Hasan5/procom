import { Types } from "mongoose";
import { getRedis } from "../../config/redis";

let redis = getRedis();

export const NOTIFICATIONS_LIST_TTL = 60;

export const getNotificationsListKey = (userId: Types.ObjectId) => {
	return `notifications:list:${userId}`;
};

export const setNotificationsListCache = async (
	userId: Types.ObjectId,
	data: any,
) => {
	try {
		return await redis.set(
			getNotificationsListKey(userId),
			JSON.stringify(data),
			{ EX: NOTIFICATIONS_LIST_TTL },
		);
	} catch {
		return null;
	}
};

export const getNotificationsListCache = async (userId: Types.ObjectId) => {
	try {
		return await redis.get(getNotificationsListKey(userId));
	} catch {
		return null;
	}
};


export const invalidateNotificationsListCache = async (userId: Types.ObjectId) => {
    try {
		return await redis.del(getNotificationsListKey(userId));
	} catch {
		return null;
	}
};