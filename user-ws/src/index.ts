function greet(name: string): string {
  return `Hello, ${name}! Welcome to your TypeScript Node.js project.`;
}

console.log(greet("Developer"));

import * as http from "http";

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    console.log("incoming request url", req.url);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello from TypeScript Node.js!\n");
  }
);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT} successfully`);
});
