import { getRedis } from "../config/redis";
let redis = getRedis();
export const PROJECT_OVERVIEW_TTL = 60; // 60 seconds
export const getProjectOverviewCacheKey = (projectId) => {
    return `project:overview:${projectId}`;
};
export const getProjectOverviewCache = async (projectId) => {
    try {
        return await redis.get(getProjectOverviewCacheKey(projectId));
    }
    catch {
        return null;
    }
};
export const setProjectOverviewCache = async (projectId, data) => {
    try {
        return await redis.set(getProjectOverviewCacheKey(projectId), JSON.stringify(data), {
            EX: PROJECT_OVERVIEW_TTL,
        });
    }
    catch {
        return null;
    }
};
export const invalidateProjectOverviewCache = async (projectId) => {
    try {
        return await redis.del(getProjectOverviewCacheKey(projectId));
    }
    catch {
        return null;
    }
};
