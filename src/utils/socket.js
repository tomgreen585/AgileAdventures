// socket.js
let socket;

export function getSocket() {
    if (!socket) {
        socket = io(`${window.location.protocol}//${window.location.hostname}`);
    }
    return socket;
}
