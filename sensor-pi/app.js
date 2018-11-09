const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server); // < Interesting!

io.on("connection", socket => {
  console.log("New client connected"), setInterval(
    () => emitData(socket),
    10000
  );
  socket.on("disconnect", () => console.log("Client disconnected"));
});
const emitData = async socket => {
  try {
    socket.emit("FromAPI", "test-data");
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};
server.listen(port, () => console.log(`Listening on port ${port}`));
