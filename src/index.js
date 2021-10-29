const http = require("http");
const path = require("path");

const express = require("express");
const socketio = require("socket.io");

const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

mongoose.connect('mongodb://localhost/socket-io')
  .then(db => console.log("database is connected"))
  .catch(err => console.log(err))

app.set("port", process.env.PORT || 3000);

require("./sockets")(io);

app.use(express.static(path.join(__dirname, "public")));

server.listen(app.get("port"), () => {
  console.log("server on port", app.get("port"));
});
