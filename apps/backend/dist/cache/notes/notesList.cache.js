import { getRedis } from "../../config/redis.js";
let redis = getRedis();
export const NOTES_LIST_TTL = 60; // 60 seconds
export const getNotesListKey = (projectId) => {
    return `notes:list:${projectId}`;
};
export const getNotesListCache = async (projectId) => {
    try {
        return await redis.get(getNotesListKey(projectId));
    }
    catch {
        return null;
    }
};
export const setNotesListCache = async (projectId, data) => {
    try {
        return await redis.set(getNotesListKey(projectId), JSON.stringify(data), {
            EX: NOTES_LIST_TTL,
        });
    }
    catch {
        return null;
    }
};
export const invalidateNotesListCache = async (projectId) => {
    try {
        return await redis.del(getNotesListKey(projectId));
    }
    catch {
        return null;
    }
};
