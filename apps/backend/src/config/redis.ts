import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config({
	path: "C:/WebDevPro/procom/apps/backend/.env",
});

type RedisClientType = ReturnType<typeof createClient>;

let redis: RedisClientType | null = null;
let redisURL = process.env.REDIS_URL

console.log(redisURL)

if (!redisURL){
	throw new Error("there is issue with redis url")
}

export async function initRedis(): Promise<RedisClientType> {
	if (redis) return redis;

	redis = createClient({
		url: redisURL,
		socket: {
			reconnectStrategy: (retries: number): number => {
				const jitter: number = Math.floor(Math.random() * 100);
				const delay: number = Math.min(
					Math.pow(2, retries) * 50,
					3000,
				);
				return jitter + delay;
			},
		},
	});

	redis.on("error", (error) =>
		console.log("⚠️ Redis clietn error", error),
	);

	await redis
		.connect()
		.then(() => console.log("✅ Redis client connected"))
		.catch((err: unknown) => console.error("⚠️", err));

	return redis;
}

export async function getRedis() {
	if (redis) return redis;
	return await initRedis()
}
