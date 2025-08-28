#!/usr/bin/env node
import http from "http";
import app from "../app.js";  // import your Express app

const PORT = normalizePort(process.env.PORT || "3000");
app.set("port", PORT);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

server.on("error", onError);
server.on("listening", onListening);

// ----------------- Helpers -----------------
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val; // named pipe
  if (port >= 0) return port;  // port number
  return false;
}

function onError(error) {
  if (error.syscall !== "listen") throw error;

  switch (error.code) {
    case "EACCES":
      console.error(`Port ${PORT} requires elevated privileges`);
      process.exit(1);
    case "EADDRINUSE":
      console.error(`Port ${PORT} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}
