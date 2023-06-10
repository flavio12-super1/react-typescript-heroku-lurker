const mongoose = require("mongoose");

const RoomScheme = mongoose.Schema({
  roomID: {
    type: String,
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("room", RoomScheme, "channels");
