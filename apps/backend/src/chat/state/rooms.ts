import { AuthedWebSocket } from "../types";
import { Types } from "mongoose";

const ProjectRooms = new Map<string, Set<AuthedWebSocket>>()

export function joinRoom(projectId: Types.ObjectId, ws: AuthedWebSocket){
    if(!ProjectRooms.get(projectId.toString())){
        ProjectRooms.set(projectId.toString(), new Set())
    }
    ProjectRooms.get(projectId.toString())?.add(ws)
}

export function getRoom(projectId: Types.ObjectId){
    return ProjectRooms.get(projectId.toString())
}