import { Request } from "express";
import { WebSocketServer } from "ws";
import { AuthedWebSocket } from "./types";
import { UserDocument } from "../types/UserModel.types";
import { onConnect } from "./onConnect";

export function initWebSocket(server: any){
    const wss = new WebSocketServer({noServer: true})

    server.on('upgrade', (req: Request, socket: any, head: Buffer) => {
        wss.handleUpgrade(req, socket, head, ws => {
            const authedWS = ws as AuthedWebSocket
            authedWS.user = req.user as UserDocument
            wss.emit('connection', ws, req)
        })
    })
    wss.on('connection', onConnect(wss))
}