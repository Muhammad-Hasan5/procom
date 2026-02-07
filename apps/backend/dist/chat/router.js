import { groupChat } from "./handlers/groupChat";
import { privateChat } from "./handlers/privateChat";
import { joinProject } from "./handlers/joinProject";
export async function router(ws, raw) {
    let msg;
    try {
        msg = JSON.parse(raw);
    }
    catch {
        return;
    }
    switch (msg.type) {
        case "join_project":
            return joinProject(ws, msg);
        case "chat":
            if (msg.scope === "group") {
                return await groupChat(ws, msg);
            }
            else {
                return await privateChat(ws, msg);
            }
    }
}
