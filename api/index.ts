import micro from "micro";
import socketio from "socket.io";
import cors from "micro-cors";
import { spawn } from "child_process";
import { Server, Socket } from "socket.io";
import { Action } from "../src/types/APIInteraction";
import { Station } from "../src/types/Station";

let nowPlaying = "";
let loadedStation: Station;

const killMusic = () => {
  const stdout = spawn("pkill", ["mplayer"]).stdout;

  return new Promise((res, _) => {
    stdout.on("end", () => {
      res();
    });
  });
};

const play = async (io: Server, data: Station) => {
  await killMusic();

  if (!data && !loadedStation) return;

  loadedStation = data || loadedStation;

  const stdout = spawn("mplayer", [loadedStation.url]).stdout;
  io.emit(Action.loadedStation, loadedStation);

  stdout.on("data", (dataBuffer: Buffer) => {
    const message = `${dataBuffer}`;

    if (message.includes("StreamUrl")) return;

    if (message.includes("ICY Info:")) {
      nowPlaying = message
        .replace("ICY Info: StreamTitle='", "")
        .replace(/ ';.*/g, "");

      io.emit(Action.songUpdate, nowPlaying);
    }
  });

  stdout.on("end", () => {
    nowPlaying = "";
    io.emit(Action.songUpdate, nowPlaying);
  });
};

const stop = async (io: Server) => {
  await killMusic();
};

const startServer = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("user connected");

    socket.emit(Action.songUpdate, nowPlaying);
    socket.emit(Action.loadedStation, loadedStation);

    socket.on(Action.play, (data: Station) => play(io, data));
    socket.on(Action.stop, stop);

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

const PORT_API = process.env.PORT_API || 8020;
const server = micro(
  cors()(async (_, res) => {
    res.end("OK");
  })
);

const io = socketio(server);

startServer(io);

server.listen(PORT_API, () =>
  console.log(`Listening on http://localhost:${PORT_API}`)
);
