import React, { useEffect } from "react";
import socketIOClient from "socket.io-client";

const URL_API = "http://localhost";

export const App = () => {
  useEffect(() => {
    const socket = socketIOClient(URL_API);
    socket.on("message", (data: string) => console.log(data));

    return () => {
      socket.send("disconnect");
    };
  }, []);
  return <h1>Hello!</h1>;
};
