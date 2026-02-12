import { getRedis } from "../../config/redis.js";
let redis = await getRedis();
export const PROJECT_LIST_TTL = 60; // 60 seconds
export const getProjectListKey = (userId) => {
    return `project:list:${userId}`;
};
export const getprojectListCache = async (userId) => {
    try {
        return await redis.get(getProjectListKey(userId));
    }
    catch {
        return null;
    }
};
export const setProjectListCache = async (userId, data) => {
    try {
        return await redis.set(getProjectListKey(userId), JSON.stringify(data), {
            EX: PROJECT_LIST_TTL,
        });
    }
    catch {
        return null;
    }
};
export const invalidateProjectListCache = async (userId) => {
    try {
        return await redis.del(getProjectListKey(userId));
    }
    catch {
        return null;
    }
};
