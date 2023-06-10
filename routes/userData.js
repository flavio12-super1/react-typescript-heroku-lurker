const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { User } = require("../models/userSchema");

async function getNotificaitons(notifications) {
  const promises = notifications.map((notification) => {
    return User.findById(notification.userID)
      .select("email")
      .populate("theme.imageURL")
      .lean()
      .exec();
  });
  const results = await Promise.all(promises);
  console.log(results);
  const notificationsWithUsername = results.map((result, index) => {
    return {
      id: notifications[index].id,
      userID: notifications[index].userID,
      email: result.email,
      imageURL: result.theme.imageURL,
    };
  });

  return notificationsWithUsername;
}

// async function getChannel(channels) {
//   const promises = channels?.map((friend) => {
//     return User.findById(friend.userID)
//       .select("email")
//       .populate("theme.imageURL")
//       .lean()
//       .exec();
//   });
//   const results = await Promise.all(promises);
//   console.log(results);
//   const friendsWithUsername = results.map((result, index) => {
//     return {
//       id: friends[index].id,
//       userID: friends[index].userID,
//       email: result.email,
//       imageURL: result.theme.imageURL,
//       channelID: friends[index].channelID,
//     };
//   });
//   return friendsWithUsername;
// }

// router.post("/", async (req, res, next) => {
//   try {
//     const user = await User.findById(req.userId);
//     const notifications = user.notifications;
//     const channels = user.channelList;
//     const following = user.following;
//     console.log("friends channel id: " + JSON.stringify(channels));

//     const notificationsWithUsername = await getNotificaitons(notifications);
//     const channelWithUsername = await getChannel(channels);
//     console.log("user data being sent to client");
//     res.json({
//       notifications: notificationsWithUsername,
//       channels: channelWithUsername,
//       following: following,
//     });
//   } catch (err) {
//     next(err);
//   }
// });
async function getChannel(channels, currentUserId) {
  const promises = channels?.map(async (channel) => {
    const otherUserId = channel.members.find(
      (member) => member !== currentUserId
    );
    const user = await User.findById(otherUserId)
      .select("email")
      .populate("theme.imageURL")
      .lean()
      .exec();

    return {
      id: channel._id,
      userID: otherUserId,
      email: user.email,
      imageURL: user.theme.imageURL,
      channelID: channel.channelID,
    };
  });

  const results = await Promise.all(promises);
  return results;
}

router.post("/", async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const notifications = user.notifications;
    const channels = user.channelList;
    const following = user.following;

    const notificationsWithUsername = await getNotificaitons(notifications);
    const channelWithUsername = await getChannel(channels, req.userId);

    res.json({
      notifications: notificationsWithUsername,
      channels: channelWithUsername,
      following: following,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
