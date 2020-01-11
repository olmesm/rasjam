import micro from "micro";
import socketio from "socket.io";

import { startServer } from "./websocket-server";

const server = micro(async (_, res) => {
  res.end("Yo");
});

const io = socketio(server);

startServer(io);

server.listen(4000, () => console.log("Listening on http://localhost:4000"));
