const { Schema, model } = require("mongoose");

const ChatSchema = new Schema({
  nick: String,
  msg: String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model("Chat", ChatSchema, "Chat");
