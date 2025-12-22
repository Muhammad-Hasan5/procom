import { createClient } from "redis";
let redis = null;
export async function initRedis() {
    if (redis)
        return redis;
    redis = createClient({
        url: process.env.REDIS_URL,
        socket: {
            reconnectStrategy: (retries) => {
                const jitter = Math.floor(Math.random() * 100);
                const delay = Math.min(Math.pow(2, retries) * 50, 3000);
                return jitter + delay;
            },
        },
    });
    redis.on("error", (error) => console.log("⚠️ Redis clietn error", error));
    await redis
        .connect()
        .then(() => console.log("✅ Redis client connected"))
        .catch((err) => console.error("⚠️", err));
    return redis;
}
export function getRedis() {
    if (redis)
        return redis;
    throw new Error("Redis is not initialized");
}
