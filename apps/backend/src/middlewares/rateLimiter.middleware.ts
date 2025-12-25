import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/async-handler";
import { ApiErrorResponse } from "../utils/api-error-response";
import { getRedis } from "../config/redis";

const redis = getRedis();

const WindowTimeInterval = 300;
const MaxRequests = 50;

export const rateLimiter = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const ip = req.ip;
		if (!ip) {
			return res
				.status(400)
				.json(new ApiErrorResponse(400, "Invalid request IP"));
		}

		const key = `rateLimit:${ip}`;

		const count = await redis.incr(key);

		if (count === 1) {
			await redis.expire(key, WindowTimeInterval);
		}

		if (count > MaxRequests) {
			return res
				.status(429)
				.json(new ApiErrorResponse(429, "Too many requests"));
		}

		next();
	},
);
