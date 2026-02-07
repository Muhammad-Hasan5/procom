import { IncomingMessage } from "./types";
import { groupChat } from "./handlers/groupChat";
import { privateChat } from "./handlers/privateChat";
import { joinProject } from "./handlers/joinProject";
import { AuthedWebSocket } from "./types";

export async function router(ws: AuthedWebSocket, raw: string) {
	let msg: IncomingMessage;

	try {
		msg = JSON.parse(raw);
	} catch {
		return;
	}

	switch (msg.type) {
		case "join_project":
			return joinProject(ws, msg);
		case "chat":
			if (msg.scope === "group") {
				return await groupChat(ws, msg);
			} else {
				return await privateChat(ws, msg);
			}
	}
}
