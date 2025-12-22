import { Types } from "mongoose";
import { getRedis } from "../config/redis";

let redis = getRedis();

export const PROJECT_LIST_TTL: number = 60; // 60 seconds

export const getProjectListKey = (userId: Types.ObjectId): string => {
	return `project:list:${userId}`;
};

export const getprojectListCache = async (userId: Types.ObjectId) => {
	try {
		return await redis.get(getProjectListKey(userId));
	} catch {
		return null;
	}
};

export const setProjectListCache = async (
	userId: Types.ObjectId,
	data: any,
) => {
	try {
		return await redis.set(
			getProjectListKey(userId),
			JSON.stringify(data),
			{
				EX: PROJECT_LIST_TTL,
			},
		);
	} catch {
		return null;
	}
};

export const invalidateProjectListCache = async (userId: Types.ObjectId) => {
	try {
		return await redis.del(getProjectListKey(userId));
	} catch {
		return null;
	}
};
