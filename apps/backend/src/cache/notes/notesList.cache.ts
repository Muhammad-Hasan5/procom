import { Types } from "mongoose";
import { getRedis } from "../../config/redis.js";
let redis = await getRedis();

export const NOTES_LIST_TTL: number = 60; // 60 seconds

export const getNotesListKey = (projectId: Types.ObjectId): string => {
	return `notes:list:${projectId}`;
};

export const getNotesListCache = async (projectId: Types.ObjectId) => {
	try {
		return await redis.get(getNotesListKey(projectId));
	} catch {
		return null;
	}
};

export const setNotesListCache = async (
	projectId: Types.ObjectId,
	data: any,
) => {
	try {
		return await redis.set(
			getNotesListKey(projectId),
			JSON.stringify(data),
			{
				EX: NOTES_LIST_TTL,
			},
		);
	} catch {
		return null;
	}
};

export const invalidateNotesListCache = async (projectId: Types.ObjectId) => {
	try {
		return await redis.del(getNotesListKey(projectId));
	} catch {
		return null;
	}
};
