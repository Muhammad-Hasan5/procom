import { Types } from "mongoose";
import { getRedis } from "../../config/redis.js";

let redis = await getRedis();

export const PROJECT_TASKS_LIST_TTL: number = 60; // 60 seconds

export const getProjectTasksListKey = (projectId: Types.ObjectId): string => {
    return `projectTasks:list:${projectId}`;
};

export const getProjectTasksListCache = async (projectId: Types.ObjectId) => {
	try {
		return await redis.get(getProjectTasksListKey(projectId));
	} catch {
		return null;
	}
};

export const setProjectTasksListCache = async (projectId: Types.ObjectId, data: any) => {
	try {
		return await redis.set(
			getProjectTasksListKey(projectId),
			JSON.stringify(data),
			{
				EX: PROJECT_TASKS_LIST_TTL,
			},
		);
	} catch {
		return null;
	}
};

export const invalidateProjectTasksListCache = async (projectId: Types.ObjectId) => {
	try {
		return await redis.del(getProjectTasksListKey(projectId));
	} catch {
		return null;
	}
};
