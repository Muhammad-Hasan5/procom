import { joinRoom } from "../state/rooms";
export function joinProject(ws, msg) {
    try {
        joinRoom(msg.projectId, ws);
    }
    catch (error) {
        throw new Error(`An error occured joing project, ${error}`);
    }
}
