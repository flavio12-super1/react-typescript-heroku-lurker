const express = require("express");
const router = express.Router();
const ContainerData = require("../models/ContainerData");

router.post("/saveTasks", async (req, res) => {
  try {
    // Destructure the prompt from req.body
    const { tasks, state } = req.body;

    console.log(tasks);
    console.log(state);

    // Convert the containerArray and containerState to JSON strings
    const containerArrayJSON = JSON.stringify(tasks);
    const containerStateJSON = JSON.stringify(state);

    // Search for existing ContainerData document
    const existingContainerData = await ContainerData.findOne();

    if (existingContainerData) {
      // If the document exists, update it with the new data
      existingContainerData.containerArray = containerArrayJSON;
      existingContainerData.containerState = containerStateJSON;
      await existingContainerData.save();
    } else {
      // If the document doesn't exist, create a new one
      const containerData = new ContainerData({
        containerArray: containerArrayJSON,
        containerState: containerStateJSON,
      });
      await containerData.save();
    }

    return res.status(201).json({ message: "Task saved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Route for retrieving tasks
router.get("/getTasks", async (req, res) => {
  try {
    console.log("getTasks");

    // Find the latest ContainerData document
    const containerData = await ContainerData.findOne().sort({ _id: -1 });

    if (!containerData) {
      return res.status(404).json({ error: "No tasks found" });
    }

    // Parse the JSON strings back to JavaScript objects
    const tasks = JSON.parse(containerData.containerArray);
    const state = JSON.parse(containerData.containerState);

    // Send the data as a JSON object to the front end
    return res.json({ tasks, state });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
