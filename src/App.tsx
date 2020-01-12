import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { Station } from "./types/Station";
import { Action } from "./types/APIInteraction";

const URL_API = "http://localhost";
const socket = socketIOClient(URL_API);

const Play = ({ socket }: { socket: SocketIOClient.Socket }) => {
  const postControl = () => {
    socket.emit(Action.play);
  };

  return <button onClick={postControl}>Play</button>;
};

const Stop = ({ socket }: { socket: SocketIOClient.Socket }) => {
  const postControl = () => {
    socket.emit(Action.stop);
  };

  return <button onClick={postControl}>Stop</button>;
};

const StationList = ({ socket }: { socket: SocketIOClient.Socket }) => {
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    (async () => {
      const data = await (await fetch("/stations.json")).json();

      setStations(data as Station[]);
    })();
  }, []);

  const postStation = (station: Station) => {
    socket.emit(Action.play, station);
  };

  if (stations.length === 0) {
    return <>Loading Stations...</>;
  }

  return (
    <div>
      {stations.map((station, index) => (
        <button key={index} onClick={() => postStation(station)}>
          {station.name}
        </button>
      ))}
    </div>
  );
};

export const App = () => {
  const [nowPlaying, setNowPlaying] = useState("");
  const [loadedStation, setLoadedStation] = useState<Station>();

  socket.on(Action.songUpdate, setNowPlaying);
  socket.on(Action.loadedStation, setLoadedStation);

  useEffect(() => {
    return () => {
      socket.send(Action.disconnect);
    };
  }, []);

  return (
    <>
      <h1>Rasjam</h1>
      <Play socket={socket} /> <Stop socket={socket} />
      <p>{loadedStation && loadedStation.name}</p>
      <p>{nowPlaying}</p>
      <hr />
      <StationList socket={socket} />
    </>
  );
};
