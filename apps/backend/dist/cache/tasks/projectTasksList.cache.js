import { getRedis } from "../../config/redis.js";
let redis = await getRedis();
export const PROJECT_TASKS_LIST_TTL = 60; // 60 seconds
export const getProjectTasksListKey = (projectId) => {
    return `projectTasks:list:${projectId}`;
};
export const getProjectTasksListCache = async (projectId) => {
    try {
        return await redis.get(getProjectTasksListKey(projectId));
    }
    catch {
        return null;
    }
};
export const setProjectTasksListCache = async (projectId, data) => {
    try {
        return await redis.set(getProjectTasksListKey(projectId), JSON.stringify(data), {
            EX: PROJECT_TASKS_LIST_TTL,
        });
    }
    catch {
        return null;
    }
};
export const invalidateProjectTasksListCache = async (projectId) => {
    try {
        return await redis.del(getProjectTasksListKey(projectId));
    }
    catch {
        return null;
    }
};
