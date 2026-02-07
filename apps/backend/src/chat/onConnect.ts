import { AuthedWebSocket } from "./types";
import { WebSocketServer } from "ws";
import { addUserSocket, removeUserSocket } from "./state/users";
import { router } from "./router";

export function onConnect(wss: WebSocketServer){
    return (ws: AuthedWebSocket) => {
        addUserSocket(ws.user._id, ws)

        ws.on('message', async data => {
            try {
                await router(ws, data.toString());
            } catch (error) {
                throw new Error(`there is error routing the ws, ${error}`)
            }
        })

        ws.on('close', () => {
            removeUserSocket(ws.user._id, ws)
        })
    }
}
