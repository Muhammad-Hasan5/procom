import WebSocket from "ws";
import { UserDocument } from "../types/UserModel.types";
import { Types } from "mongoose";

export interface AuthedWebSocket extends WebSocket {
	user: UserDocument;
}

export interface BaseMessage {
	type: string;
}

export interface JoinProjectMessage extends BaseMessage {
	type: "join_project";
	projectId: Types.ObjectId;
}

export interface ChatMessage extends BaseMessage {
	type: "chat";
	scope: "group" | "private";
	projectId: Types.ObjectId;
	receiverId?: Types.ObjectId;
	payload: {
		message: string;
	};
}

export type IncomingMessage = JoinProjectMessage | ChatMessage;
