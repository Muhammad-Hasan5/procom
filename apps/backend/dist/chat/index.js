import { WebSocketServer } from "ws";
import { onConnect } from "./onConnect";
export function initWebSocket(server) {
    const wss = new WebSocketServer({ noServer: true });
    server.on('upgrade', (req, socket, head) => {
        wss.handleUpgrade(req, socket, head, ws => {
            const authedWS = ws;
            authedWS.user = req.user;
            wss.emit('connection', ws, req);
        });
    });
    wss.on('connection', onConnect(wss));
}
