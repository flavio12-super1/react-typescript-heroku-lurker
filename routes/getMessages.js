const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { User } = require("../models/userSchema");
const Message = require("../models/message");

router.post("/", async (req, res, next) => {
  const { roomID } = req.body;
  console.log("roomd id: " + roomID);
  const userId = req.userId;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Search for a channel that includes both current user and target user
    const channel = user.channelList.find(
      (channel) =>
        channel.members.includes(userId) && channel.channelID == roomID
    );

    if (channel) {
      console.log("found");
      console.log("channel messageReferanceID: " + channel.messageReferanceID);
      const message = await Message.findOne({
        messageID: channel.messageReferanceID,
      });
      console.log(message.message.length);
      if (message.message.length == 0) {
        return res.json({
          status: true,
          messageID: channel.messageReferanceID,
          messages: message.message,
        });
      }
      // Channel found, return its channelID
      return res.json({
        status: false,
        messageID: channel.messageReferanceID,
        messages: message.message,
      });
    } else {
      console.log("not found");

      return res.json({ error: "room doesnt exist" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error saving user");
  }
});

module.exports = router;
