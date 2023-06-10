const mongoose = require("mongoose");

const ChannelSchema = mongoose.Schema({
  channelID: {
    type: String,
  },
  members: {
    type: [{ type: String, required: true }],
  },
  messageReferanceID: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("channel", ChannelSchema, "channels");
