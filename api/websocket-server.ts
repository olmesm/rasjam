import { Server, Socket } from "socket.io";

export const startServer = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("a user connected");

    socket.emit("message", "hello");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
