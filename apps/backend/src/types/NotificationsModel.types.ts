import { Document, Model, Types } from "mongoose";

export interface INotification {
	user: Types.ObjectId;
	type:
		| "WELCOME_TO_APP"
		| "PROJECT_CREATED"
		| "PROJECT_ENDED"
		| "MEMBER_ADDED"
		| "MEMBER_REMOVED"
		| "OWNER_CHANGED"
		| "TASK_CREATED"
		| "NOTE_ADDED"
		| "CALL_INVITATION";
	message: string;
	data?: object;
	read: boolean;
}

export interface INotificationDocument extends INotification, Document {
    createdAt: Date
    updatedAt: Date
}

export interface INotificationModel extends Model<INotificationDocument> {}

export type NotificationDocument = Document<Types.ObjectId> & INotification