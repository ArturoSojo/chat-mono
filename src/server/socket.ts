import { Server as IOServer } from "socket.io";
import type { Server } from "http";

export function attachSocket(server: Server) {
  const io = new IOServer(server, { path: "/socket.io", cors: { origin: "*" } });

  const chat = io.of("/chat");
  chat.use(async (socket, next) => { /* TODO: verificar ID Token */ next(); });

  chat.on("connection", (socket) => {
    socket.on("join", ({ userId }) => { socket.join(`user:${userId}`); });
    socket.on("typing:start", ({ conversationId }) => socket.to(`conv:${conversationId}`).emit("typing:update", { isTyping:true }));
    // TODO: message:send -> persistir en Firestore y emitir message:new
  });

  const calls = io.of("/calls");
  calls.on("connection", (socket) => {
    socket.on("call:init", ({ calleeId, callId }) => {
      socket.to(`user:${calleeId}`).emit("call:ringing", { callId });
    });
  });

  return io;
}
