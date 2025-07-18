function greet(name: string): string {
  return `Hello, ${name}! Welcome to your TypeScript Node.js project.`;
}

console.log(greet("Developer"));

import * as http from "http";
import { startWSS } from "./socket";

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    console.log("incoming http request url", req.url);

    if (req.url === "/") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end("Hello from TypeScript Node.js!\n");
    } else if (req.url === "/api") {
      res.statusCode === 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "This is an API endpoint" }));
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain");
      res.end("Not Found\n");
    }
  }
);

const PORT = process.env.PORT || 3000;
const wss = startWSS(server); // passing server instance to run both http & socket on the same port

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
  } else {
    console.error("HTTP server error:", err);
  }
  process.exit(1); // Exit if the server can't start due to port issues
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT} successfully`);
  console.log(
    `WebSocket server is now listening on the same port (${PORT}) successfully`
  );
});

// Example of how to access the WSS instance if you need to broadcast later
setInterval(() => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send("!ping");
    }
  });
  console.log("!ping")
}, 30000);
