import { AuthedWebSocket, ChatMessage } from "../types";
import { getUserSocket } from "../state/users";
import { Message } from "../../models/chatMessages.model";
import { ApiErrorResponse } from "../../utils/api-error-response";

export async function privateChat(ws: AuthedWebSocket, msg: ChatMessage) {
	try {
		const targets = getUserSocket(msg.receiverId!);
		if (!targets || targets.size === 0) return;

		const message = await Message.create({
			projectId: msg.projectId,
			senderId: ws.user?._id,
			receiverId: msg.receiverId,
			scope: msg.scope,
			payload: msg.payload,
		});

		if (!message) {
			throw new ApiErrorResponse(
				200,
				"There is error saving new message to Db, not sending to receiver",
			);
		}

		for (const client of targets) {
			if (client.readyState === client.OPEN) {
				client.send(
					JSON.stringify({
						scope: message.scope,
						from: message.senderId,
						payload: message.payload,
					}),
				);
			}
		}
	} catch (error) {
		throw new Error(`there is error sending message privately ${error}`);
	}
}
