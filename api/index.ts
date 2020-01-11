import micro from "micro";
import socketio from "socket.io";
import { startServer } from "./websocket-server";

const PORT_API = process.env.PORT_API || 8020;

const server = micro(async (_, res) => {
  res.end("Yo");
});

const io = socketio(server);

startServer(io);

server.listen(PORT_API, () =>
  console.log(`Listening on http://localhost:${PORT_API}`)
);
