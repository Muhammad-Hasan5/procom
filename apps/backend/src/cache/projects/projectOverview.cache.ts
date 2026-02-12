import { Types } from "mongoose";
import { getRedis } from "../../config/redis.js";

let redis = await getRedis();

export const PROJECT_OVERVIEW_TTL: number = 60; // 60 seconds

export const getProjectOverviewCacheKey = (
	projectId: Types.ObjectId,
): string => {
	return `project:overview:${projectId}`;
};

export const getProjectOverviewCache = async (projectId: Types.ObjectId) => {
	try {
		return await redis.get(getProjectOverviewCacheKey(projectId));
	} catch {
		return null;
	}
};

export const setProjectOverviewCache = async (
	projectId: Types.ObjectId,
	data: any,
) => {
	try {
		return await redis.set(
			getProjectOverviewCacheKey(projectId),
			JSON.stringify(data),
			{
				EX: PROJECT_OVERVIEW_TTL,
			},
		);
	} catch {
		return null;
	}
};

export const invalidateProjectOverviewCache = async (
	projectId: Types.ObjectId,
) => {
	try {
		return await redis.del(getProjectOverviewCacheKey(projectId));
	} catch {
		return null;
	}
};
