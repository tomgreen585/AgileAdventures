require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const socket_io = require('socket.io');
const Room = require('./room.js');
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 80;

app.use(cors());
app.use(express.static('src'));

// Socket.io setup
const ioServer = new socket_io.Server(server, {
    cors: {
        origin: '*',  // Consider restricting this in production
        methods: ['GET', 'POST']
    }
});

/** @type {Map<string, Room>} */
rooms = new Map()

// Start the server
server.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] Server is running on port ${PORT}`);
    console.log(`[${new Date().toISOString()}] Connect to server through this link http://localhost:${PORT}/`);
});

// Socket.io connection handler
ioServer.on('connection', (socket) => {
    console.log(`[${new Date().toISOString()}] New player connected: ${socket.id}`);

    // Handle room creation
    socket.on('createRoom', (roomName) => {
        if (!roomName || typeof roomName !== 'string' || roomName.trim() === '') {
            socket.emit('roomError', 'Invalid room name');
            return;
        }
        roomName = roomName.trim();
        if (!rooms.has(roomName)) {
            rooms.set(roomName, new Room(roomName));
            console.log(`[${new Date().toISOString()}] Room created: ${roomName}`);
        }
        joinRoom(roomName, socket);
    });

    // Handle room names request
    socket.on('requestRoomNames', () => {
        socket.emit('roomNames', getRoomNames());
    });

    // Handle joining a room
    socket.on('joinRoom', (roomName) => {
        if (!roomName || typeof roomName !== 'string' || roomName.trim() === '') {
            socket.emit('roomError', 'Invalid room name');
            return;
        }
        roomName = roomName.trim();
        if (rooms.has(roomName)) {
            joinRoom(roomName, socket);
        } else {
            socket.emit('roomError', 'Room does not exist');
        }
    });

    // Handle player movement
    socket.on('playerMoved', (data) => {
        let {roomName, position, direction, isMoving} = data;
        let room = rooms.get(roomName);
        if (room) {
            let player = room.getPlayers().find(p => p.id === socket.id);
            if (player) {
                player.position = position;
                player.direction = direction;
                player.isMoving = isMoving;
                ioServer.to(roomName).emit('updatePlayers', room.getPlayers());
            }
        }
    });

    socket.on('taskMoved', (data) => {
        const {roomName, taskName, state, row} = data;
        if (rooms.has(roomName)) {
            const task = rooms.get(roomName).getTasks();
            if (task) {
                const updatedTask = task.get(taskName);
                if (updatedTask) {
                    updatedTask.state = state;
                    updatedTask.row = row;
                    task.set(taskName, updatedTask);
                }
                const list = Array.from(task.values());

                if (rooms.get(roomName).gameOver()) {
                    ioServer.to(roomName).emit('gameOver', rooms.get(roomName).gameTime());
                } else {
                    console.log(list)
                    ioServer.to(roomName).emit('updateTasks', list);
                }
            }
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        for (let roomName of rooms.keys()) {
            let room = rooms.get(roomName);
            if (room) {
                room.setPlayers(room.getPlayers().filter(player => player.id !== socket.id));
                if (room.getPlayers().length === 0) {
                    rooms.delete(roomName);
                } else {
                    ioServer.to(roomName).emit('updatePlayers', room.getPlayers());
                }
                console.log(`[${new Date().toISOString()}] Player disconnected: ${socket.id} from room: ${roomName}`);
            }
        }
    });
});

// Helper functions
function joinRoom(roomName, socket) {
    socket.join(roomName);
    console.log(`[${new Date().toISOString()}] Player ${socket.id} joined room: ${roomName}`);

    let newPlayer = {id: socket.id, position: {x: 48 * 18, y: 48 * 20}, direction: 'NONE', isMoving: false};
    rooms.get(roomName).newPlayer(newPlayer);

    socket.emit('updatePlayers', rooms.get(roomName).getPlayers());
    socket.broadcast.to(roomName).emit('updatePlayers', rooms.get(roomName).getPlayers());
}

function getRoomNames() {
    return Array.from(rooms.keys()).join(', ');
}
