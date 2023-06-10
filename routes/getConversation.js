const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { User } = require("../models/userSchema");

const Message = require("../models/message");

// router.post("/", async (req, res, next) => {
//   const { id } = req.body; // Assuming the selected theme is sent from the frontend
//   console.log("currently viewing id: " + id);

//   const userId = req.userId; // Assuming you have the user's ID in the session
//   console.log("user id: " + userId);
//   try {
//     // const user = await User.findOne({ _id: userId });

//     const user = await User.findById(userId)
//       .select("email")
//       .populate("channelList")
//       .lean()
//       .exec();
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     console.log(user);
//     res.json({ channelID: "testing" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error saving user");
//   }
// });
const crypto = require("crypto");

// Function to generate a unique channelID
const generateUniqueChannelID = () => {
  const length = 8; // Length of the channelID
  return crypto.randomBytes(length).toString("hex");
};

router.post("/", async (req, res, next) => {
  const { id } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Search for a channel that includes both current user and target user
    const channel = user.channelList.find(
      (channel) =>
        channel.members.includes(id) && channel.members.includes(userId)
    );

    if (channel) {
      console.log("found");
      // Channel found, return its channelID
      return res.json({ channelID: channel.channelID });
    } else {
      console.log("not found");
      // Channel not found, create a new channel

      const messageId = crypto.randomBytes(16).toString("hex");
      const message = new Message({
        messageID: messageId,
        message: [],
      });
      const savedMessage = await message.save();

      const newChannel = {
        members: [id, userId],
        channelID: generateUniqueChannelID(), // Use your method or library to generate a unique channelID
        messageReferanceID: savedMessage.messageID,
        state: true,
      };

      // Save the new channel and update the user's channelList
      await User.findOneAndUpdate(
        { _id: userId },
        { $push: { channelList: newChannel } }
      );

      // Return the newly created channelID
      return res.json({ channelID: newChannel.channelID });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error saving user");
  }
});

module.exports = router;
