import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('dist'));
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})

const userSocketMap = {};
const roomMessages = {};

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        };
    });
}

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on("join", ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        const messages = roomMessages[roomId] || [];

        socket.emit("joined", {
            clients,
            username,
            socketId: socket.id,
            messages
        });

        clients.forEach(({ socketId }) => {
            io.to(socketId).emit("joined", {
                clients,
                username,
                socketId: socket.id,
                messages
            });
        });
    });

    socket.on("code-change", ({ roomId, code }) => {
        socket.in(roomId).emit("code-change", { code });
    });

    socket.on("sync-code", ({ socketId, code }) => {
        io.to(socketId).emit("code-change", { code });
    });

    socket.on("dropdown-change", ({ roomId, option }) => {
        socket.in(roomId).emit("dropdown-change", { option });
    });

    socket.on("sync-dropdown", ({ socketId, option }) => {
        io.to(socketId).emit("dropdown-change", { option });
    });

    socket.on("input-change", ({ roomId, input }) => {
        socket.in(roomId).emit("input-change", { input });
    });

    socket.on("sync-input", ({ socketId, input }) => {
        io.to(socketId).emit("input-change", { input });
    });

    socket.on("output-change", ({ roomId, output }) => {
        socket.in(roomId).emit("output-change", { output });
    });

    socket.on("sync-output", ({ socketId, output }) => {
        io.to(socketId).emit("output-change", { output });
    });

    socket.on("send_message", (data) => {
        if (!roomMessages[data.room]) {
            roomMessages[data.room] = [];
        }
        roomMessages[data.room].push(data);
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit("disconnected", {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });

            setTimeout(() => {
                const remainingClients = getAllConnectedClients(roomId);
                if (remainingClients.length === 0) {
                    delete roomMessages[roomId];
                }
            }, 1000);
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});

const PORT = 5000;
server.listen(PORT, () => { console.log(`Listening on port ${PORT}`) });
