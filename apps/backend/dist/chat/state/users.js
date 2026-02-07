const UserWebSockets = new Map();
export function addUserSocket(userId, ws) {
    if (!UserWebSockets.has(userId.toString())) {
        UserWebSockets.set(userId.toString(), new Set());
    }
    UserWebSockets.get(userId.toString())?.add(ws);
}
export function removeUserSocket(userId, ws) {
    UserWebSockets.get(userId.toString())?.delete(ws);
    if (UserWebSockets.get(userId.toString())?.size === 0) {
        UserWebSockets.delete(userId.toString());
    }
}
export function getUserSocket(userId) {
    return UserWebSockets.get(userId.toString());
}
