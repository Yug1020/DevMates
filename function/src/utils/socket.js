import { createHash } from "crypto";
import { Server } from "socket.io";

const getRoomId = (userId, targetId) => {
  const compoundId = [String(userId), String(targetId)].sort().join("_");
  return createHash("sha256").update(compoundId).digest("hex");
};

export const initializeSocket = (server) => {
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:5173"
      }
    });

    io.on("connection", (socket) => {

      socket.on("joinchat", ({ userId, targetId, senderName }) => {
        if (!userId || !targetId) return;

        const roomId = getRoomId(userId, targetId);
        console.log(senderName || userId, "joined the room");
        socket.join(roomId);
      });

      socket.on("sendmsg", ({ senderName, firstName, newMessage, userId, targetId }) => {
        const messageText = newMessage?.trim();
        if (!userId || !targetId || !messageText) return;

        const roomId = getRoomId(userId, targetId);
        const message = {
          id: `${socket.id}-${Date.now()}`,
          senderId: String(userId),
          senderName: senderName || firstName || "Unknown",
          content: messageText,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        // console.log(`${message.senderName} : ${message.content}`);
        io.to(roomId).emit("messageReceived", message);
      })

      socket.on("disconnect", () => {});

    });
}
