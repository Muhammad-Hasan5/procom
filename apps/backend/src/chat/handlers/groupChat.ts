import { AuthedWebSocket, ChatMessage } from "../types";
import { getRoom } from "../state/rooms";
import { Message } from "../../models/chatMessages.model";
import { ApiErrorResponse } from "../../utils/api-error-response";

export async function groupChat(ws: AuthedWebSocket, msg: ChatMessage) {
	try {
		const room = getRoom(msg.projectId);
		if (!room) return;

		const message = await Message.create({
			projectId: msg.projectId,
			senderId: ws.user?._id,
			receiverId: null,
			scope: msg.scope,
			payload: msg.payload
		})

		if(!message) {
			throw new ApiErrorResponse(200, "Error saving message to DB, not sended")
		}

		for (const client of room) {
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
		throw new Error(`there is error sending message in room ${error}`);
	}
}
