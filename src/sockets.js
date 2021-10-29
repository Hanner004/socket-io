const ChatSchema = require("./models/Chat");

module.exports = function (io) {
  let users = {};

  io.on("connection", async (socket) => {
    // console.log("new user connected");

    let messages = await ChatSchema.find().sort({_id: -1}).limit(10)
    messages.reverse()
    socket.emit("load old msgs", messages)

    socket.on("new user", (data, cb) => {
      // console.log(data)
      if (data in users) {
        cb(false);
      } else {
        cb(true);
        socket.nickname = data;
        users[socket.nickname] = socket;
        updateNicknames();
      }
    });

    socket.on("send message", async (data, cb) => {
      var msg = data.trim();

      if (msg.substr(0, 3) === "/p ") {
        msg = msg.substr(3);
        var index = msg.indexOf(" ");
        if (index !== -1) {
          var name = msg.substring(0, index);
          var msg = msg.substring(index + 1);
          if (name in users) {
            users[name].emit("whisper", {
              msg,
              nick: socket.nickname,
            });
          } else {
            cb("Error! Enter a valid User");
          }
        } else {
          cb("Error! Please enter your message");
        }
      } else {

        var newChat = new ChatSchema({
          msg,
          nick: socket.nickname
        })
        await newChat.save()

        io.sockets.emit("new message", {
          msg,
          nick: socket.nickname,
        });
      }
    });

    socket.on("disconnect", (data) => {
      if (!socket.nickname) return;
      delete users[socket.nickname];
      updateNicknames();
    });

    function updateNicknames() {
      io.sockets.emit("usernames", Object.keys(users));
    }
  });
};
