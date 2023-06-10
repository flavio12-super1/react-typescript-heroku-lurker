const express = require("express");
const router = express.Router();
// const { User, Post } = require("../path/to/userModel"); // Replace '../path/to/userModel' with the actual path to your userModel file
const { User } = require("../models/userSchema");

async function getFriends(friends) {
  const promises = friends?.map((friend) => {
    return User.findById(friend.userID)
      .select("email")
      .populate("theme.imageURL")
      .lean()
      .exec();
  });
  const results = await Promise.all(promises);
  console.log(results);
  const friendsWithUsername = results.map((result, index) => {
    return {
      userID: result._id,
      email: result.email,
      imageURL: result.theme.imageURL,
    };
  });
  return friendsWithUsername;
}

router.post("/following", async (req, res) => {
  const { id } = req.body;
  try {
    // Retrieve the user from the database based on the user's ID
    const user = await User.findById(id); // Assuming you have the userId available in the request

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const friendsWithUsername = await getFriends(user.following);
    res.status(200).json({
      friends: friendsWithUsername,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/followers", async (req, res) => {
  const { id } = req.body;
  try {
    // Retrieve the user from the database based on the user's ID
    const user = await User.findById(id); // Assuming you have the userId available in the request

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const friendsWithUsername = await getFriends(user.followers);
    res.status(200).json({
      friends: friendsWithUsername,
    });
    // res.status(200).json(user.followers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
