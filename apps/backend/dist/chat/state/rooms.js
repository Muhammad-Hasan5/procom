const ProjectRooms = new Map();
export function joinRoom(projectId, ws) {
    if (!ProjectRooms.get(projectId.toString())) {
        ProjectRooms.set(projectId.toString(), new Set());
    }
    ProjectRooms.get(projectId.toString())?.add(ws);
}
export function getRoom(projectId) {
    return ProjectRooms.get(projectId.toString());
}
