import { Types } from "mongoose";
import { AuthedWebSocket } from "../types";

const UserWebSockets = new Map<string, Set<AuthedWebSocket>>();

export function addUserSocket(userId: Types.ObjectId, ws: AuthedWebSocket) {
	if (!UserWebSockets.has(userId.toString())) {
		UserWebSockets.set(userId.toString(), new Set());
	}
	UserWebSockets.get(userId.toString())?.add(ws);
}

export function removeUserSocket(userId: Types.ObjectId, ws: AuthedWebSocket) {
	UserWebSockets.get(userId.toString())?.delete(ws);
	if (UserWebSockets.get(userId.toString())?.size === 0) {
		UserWebSockets.delete(userId.toString());
	}
}

export function getUserSocket(userId: Types.ObjectId) {
	return UserWebSockets.get(userId.toString());
}
