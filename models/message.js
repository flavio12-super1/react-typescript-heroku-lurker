const mongoose = require("mongoose");

const Data = mongoose.Schema({
  userID: {
    type: { type: String, required: true },
  },
  message: {
    type: Object,
    required: false,
  },
  images: {
    type: [String],
    required: false,
  },
  messageReferance: {
    type: String,
  },
});

const MessageSchema = mongoose.Schema({
  messageID: {
    type: String,
  },
  message: {
    type: [Data],
  },
});

// module.exports = mongoose.model("message", MessageScheme, "messages");

const Message = mongoose.model("Message", MessageSchema, "messages");

module.exports = Message;
