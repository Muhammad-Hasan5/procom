import { joinRoom } from "../state/rooms";
import { AuthedWebSocket, JoinProjectMessage } from "../types";

export function joinProject(ws: AuthedWebSocket, msg: JoinProjectMessage) {
    try {
        joinRoom(msg.projectId, ws)
    } catch (error) {
        throw new Error(`An error occured joing project, ${error}`)
    }
}