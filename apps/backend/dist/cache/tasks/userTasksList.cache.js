import { getRedis } from "../../config/redis.js";
let redis = await getRedis();
export const USER_TASKS_LIST_TTL = 60; // 60 seconds
export const getUserTasksListKey = (userId, projectId) => {
    return `user:${userId}:taskslist:${projectId}`;
};
export const getUserTasksListCache = async (userId, projectId) => {
    try {
        return await redis.get(getUserTasksListKey(userId, projectId));
    }
    catch {
        return null;
    }
};
export const setUserTasksListCache = async (userId, projectId, data) => {
    try {
        return await redis.set(getUserTasksListKey(userId, projectId), JSON.stringify(data), {
            EX: USER_TASKS_LIST_TTL,
        });
    }
    catch {
        return null;
    }
};
export const invalidateUserTasksListCache = async (userId, projectId) => {
    try {
        return await redis.del(getUserTasksListKey(userId, projectId));
    }
    catch {
        return null;
    }
};
