import { Document, Types, Model } from "mongoose";

export interface IChatMessage {
	projectId: Types.ObjectId;
	scope: "group" | "private";
	receiverId?: Types.ObjectId | null;
	senderId: Types.ObjectId;
	payload: {
		message: string
	};
}

export interface IChatMessageDocument extends IChatMessage, Document {
	createdAt: Date;
	updatedAt: Date;
}

export interface IChatMessageModel extends Model<IChatMessageDocument> {}

export type ChatMessageDocument = Document<Types.ObjectId> & IChatMessage;
