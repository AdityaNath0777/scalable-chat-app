import * as http from "http";
import { WebSocketServer, WebSocket } from "ws";

// but recommended approach is to run socket & http server on the same port
// in most of the cases it holds true
// pros: easy to scale, single point of failure, easier load balancing, etc.
// cons: if one goes down, both goes down
const SOCKET_PORT = parseInt(process.env.SOCKET_PORT || "") || 8080;
const HOSTNAME = process.env.HOSTNAME || "localhost";
const SOCKET_URL = `ws:${HOSTNAME}:${SOCKET_PORT}`;

interface Room {
  sockets: WebSocket[];
}

// hash map -> more optimzed for hashing than a regual object
const rooms = new Map<string, Room>();

export const startWSS = (server?: http.Server) => {
  console.log("yo wss here!");
  const wss = server
    ? new WebSocketServer({ server })
    : new WebSocketServer({ port: SOCKET_PORT });

  wss.on("connection", function connection(ws) {
    // event, listener function
    console.log("yo, connection establiahed");
    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    ws.on("message", function message(data: string) {
      console.log("received: %s", data);
      const parsedData = JSON.parse(data);
      if (parsedData.type === "join-room") {
        const room = parsedData.room;

        if (!rooms.has(room)) {
          // initialize new room
          rooms.set(room, { sockets: [] });
        }

        const roomData = { sockets: [...(rooms.get(room)?.sockets || []), ws] };
        rooms.set(room, roomData);
        ws.send(`room: ${room} joined successfully!`);
        console.log(`room: ${room} joined successfully!`);
      }

      if (parsedData.type === "chat") {
        const room = parsedData.room;

        if (!rooms.has(room)) {
          console.log("user still hasn't joined any room");
          ws.send("user still hasn't joined any room");
        } else {
          const roomData = rooms.get(room);
          roomData?.sockets.map((socket) => socket.send(parsedData.message));
        }
      }
    });

    ws.on("close", () => {
      console.log(`Websocket client disconnected`);
    });

    ws.send("Welcome to the WebSocket server!");
  });

  // Handle errors on the WebSocketServer itself
  wss.on("error", (error) => {
    console.error("WebSocket server error:", error);
  });

  // If not attached to an HTTP server, log the standalone port
  if (!server) {
    console.log(
      `WebSocket server running at ws://localhost:${SOCKET_PORT} successfully`
    );
  }

  return wss;
};

const WSS = { startWSS };
export default WSS;
