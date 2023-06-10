const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// const userSchema = require("../models/userSchema");

// const User = mongoose.model("User", userSchema);
const { User } = require("../models/userSchema");

router.post("/", async (req, res, next) => {
  //saving user profile themes

  const { theme } = req.body; // Assuming the selected theme is sent from the frontend
  console.log(theme);
  console.log(theme.bc);

  // Update the profileTheme array in the session
  req.session.profileTheme = req.session.profileTheme || []; // Initialize the array if it doesn't exist
  req.session.profileTheme = theme;
  const userId = req.userId; // Assuming you have the user's ID in the session
  try {
    // Update the user's document in the database with the selected theme

    console.log(userId);

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Update the theme field in the user's document
    user.theme = {};
    user.theme = theme;

    // Save the updated user document
    await user.save();
    res.json({ theme: theme });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving user");
  }
});

module.exports = router;
