const express = require("express");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const router = express.Router();
// const { User, Post } = require("../path/to/userModel"); // Replace '../path/to/userModel' with the actual path to your userModel file
const { User, Post, Reply } = require("../models/userSchema");

// Route for uploading a post
router.post("/", async (req, res) => {
  try {
    // Retrieve the user from the database based on the user's ID
    const user = await User.findById(req.userId); // Assuming you have the userId available in the request

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new post
    const post = new Post({
      user: user._id, // Set the user for the post
      content: req.body.content, // Assuming the post content is sent in the request body
      replyId: generateRandomString(12), // Generate UUID for replyId
      createdAt: Date.now(),
    });

    // Save the post
    await post.save();

    const postObject = {
      id: post._id,
      createdAt: post.createdAt,
    };

    // Update the user's posts array with the new post ID at the start
    // user.posts.unshift(post._id);
    user.posts.unshift(postObject);
    await user.save();

    return res.status(201).json(post); // Return the created post in the response
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    // Retrieve the user from the database based on the user's ID
    const user = await User.findById(req.userId); // Assuming you have the userId available in the request

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let { page, pageSize } = req.query;
    page = parseInt(page);
    pageSize = parseInt(pageSize);

    // Calculate the starting index based on the page and pageSize
    const startIndex = (page - 1) * pageSize;

    const allPostData = [
      ...user.posts.map((post) => ({
        id: post.id,
        user: {
          id: user._id,
          username: user.email,
          imageURL: user.theme.imageURL,
        },
      })),
    ];

    // Retrieve the posts from followers
    for (const followerId of user.followers) {
      const follower = await User.findById(followerId.userID);
      if (follower) {
        allPostData.push(
          ...follower.posts.map((post) => ({
            id: post.id,
            user: {
              id: follower._id,
              username: follower.email,
              imageURL: follower.theme.imageURL,
            },
          }))
        );
      }
    }

    // Retrieve the posts from following
    for (const followingId of user.following) {
      const following = await User.findById(followingId.userID);
      if (following) {
        allPostData.push(
          ...following.posts.map((post) => ({
            id: post.id,
            user: {
              id: following._id,
              username: following.email,
              imageURL: following.theme.imageURL,
            },
          }))
        );
      }
    }

    // Sort all post data by creation date (descending order)
    allPostData.sort((a, b) => b.id.getTimestamp() - a.id.getTimestamp());

    // Retrieve the post IDs based on the startIndex and pageSize
    const postIds = allPostData
      .slice(startIndex, startIndex + pageSize)
      .map((post) => post.id);

    // Retrieve the posts based on the IDs and sort them in the order of the IDs
    const posts = await Post.find({ _id: { $in: postIds } }).sort({ _id: -1 });
    const hasMorePosts = user.posts.length > startIndex + pageSize;

    // Function to recursively retrieve nested replies for a reply
    const retrieveNestedReplies = async (reply, user) => {
      const nestedReplies = await Reply.find({ _id: { $in: reply.replies } });
      const nestedRepliesWithNested = await Promise.all(
        nestedReplies.map(async (nestedReply) => {
          const nestedUser = await User.findById(nestedReply.user);
          // Check if req.userId has voted on any of the polls attached to the reply
          const nestedReplies = await retrieveNestedReplies(
            nestedReply,
            nestedUser
          );
          return {
            ...nestedReply.toObject(),
            replies: nestedReplies,
            // user: nestedUser,
            user: {
              id: nestedUser._id,
              username: nestedUser.email,
              imageURL: nestedUser.theme.imageURL,
            },
          };
        })
      );
      return nestedRepliesWithNested;
    };

    // Retrieve nested replies for each post
    const postsWithReplies = await Promise.all(
      posts.map(async (post) => {
        const postUser = allPostData.find((postData) =>
          postData.id.equals(post._id)
        ).user;
        const replies = await Reply.find({ _id: { $in: post.replies } });
        const repliesWithNested = await Promise.all(
          replies.map(async (reply) => {
            const replyUser = await User.findById(reply.user);
            const nestedReplies = await retrieveNestedReplies(reply, replyUser);

            // //start here
            const pollOptions = reply.toObject().pollOptions;
            // Count the votes for each poll option
            const voteCounts = {};
            pollOptions.forEach((pollOption) => {
              pollOption.options.forEach((option) => {
                voteCounts[option] = pollOption.votes.filter(
                  (vote) => vote.option === option
                ).length;
              });
            });
            console.log("Vote Counts:", voteCounts);

            // Check if the user has already voted
            const existingVoteIndex = reply
              .toObject()
              .pollOptions.findIndex((pollOption) => {
                return pollOption.votes.some(
                  (vote) => vote.userID.toString() === req.userId
                );
              });

            console.log("Existing Vote Index:", existingVoteIndex);

            // Start here
            let userVoteOption = null;
            if (existingVoteIndex !== -1) {
              const existingVote =
                reply.toObject().pollOptions[existingVoteIndex];
              const userVote = existingVote.votes.find(
                (vote) => vote.userID.toString() === req.userId
              );
              userVoteOption = userVote.option;
            }

            console.log("User's Vote Option:", userVoteOption);
            //end here

            return {
              ...reply.toObject(),
              pollOptions: undefined, // Remove the pollOptions property
              replies: nestedReplies,
              user: {
                id: replyUser._id,
                username: replyUser.email,
                imageURL: replyUser.theme.imageURL,
              },
              pollOption: userVoteOption,
              voteCounts: voteCounts,
            };
          })
        );
        return {
          ...post.toObject(),
          replies: repliesWithNested,
          user: postUser,
        };
      })
    );

    console.log(postsWithReplies);

    return res.json({ posts: postsWithReplies, hasMorePosts: hasMorePosts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:postId/replies", async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentReplyId } = req.body;

    console.log(postId);
    console.log(content);
    console.log(parentReplyId);

    // Find the post containing the replyId
    const post = await Post.findOne({ replyId: postId });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    console.log("poll: " + req.body.pollOptions);

    // Create the new reply
    const newReply = new Reply({
      user: req.userId, // Assuming you have an authenticated user available
      content,
      pollOptions: { options: req.body.pollOptions },
      createdAt: Date.now(),
      replyId: generateRandomString(12), // Generate random string for replyId
      replies: [], // Initialize replies as an empty array
    });

    // Check if the parentReplyId is provided
    if (parentReplyId !== postId) {
      // Find the parent reply in the post's replies array
      const parentReply = await Reply.findOne({ replyId: parentReplyId });
      if (!parentReply) {
        return res.status(404).json({ error: "Parent reply not found" });
      }

      // Add the new reply to the parent reply's replies array
      parentReply.replies.push(newReply._id);
      await parentReply.save();
    } else {
      // Add the new reply to the post's replies array
      post.replies.push(newReply._id);
      await post.save();
    }

    // Save the new reply
    await newReply.save();

    res.json(newReply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const generateRandomString = (length) => {
  return crypto.randomBytes(length).toString("hex");
};

router.post("/:postId/vote", async (req, res) => {
  try {
    const { postId } = req.params;
    const { option } = req.body;
    const userId = req.userId;

    // Find the post containing the replyId
    const post = await Reply.findOne({ replyId: postId });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already voted
    const existingVoteIndex = post.pollOptions.findIndex((pollOption) => {
      console.log("Poll Option Votes:");
      pollOption.votes.forEach((vote) => {
        console.log("Vote:", vote);
        console.log("User ID:", vote.userID.toString());
      });
      return pollOption.votes.some((vote) => vote.userID.toString() === userId);
    });

    console.log("Existing Vote Index:", existingVoteIndex);

    // Update the vote
    if (existingVoteIndex !== -1) {
      const existingVote = post.pollOptions[existingVoteIndex].votes.find(
        (vote) => vote.userID.toString() === userId
      );

      console.log(existingVote.option);

      if (existingVote.option === option) {
        // User has already voted for the same option, no need to update
        return res.status(400).json({
          error: "User has already voted for this option",
        });
      } else {
        // User has voted for a different option, remove the old vote
        console.log("Removing old vote");
        console.log("Existing Vote:", existingVote);

        const updatedPoll = await Reply.findOneAndUpdate(
          { replyId: postId },
          {
            $pull: {
              "pollOptions.$[].votes": {
                _id: existingVote._id,
              },
            },
          },
          { new: true }
        );

        if (!updatedPoll) {
          console.log("Post not found");
        }
      }
    }
    console.log("userId: " + userId);
    console.log("option: " + option);
    // Find the post containing the replyId
    const updatedPoll = await Reply.findOneAndUpdate(
      { replyId: postId },
      {
        $push: {
          "pollOptions.$[].votes": {
            userID: userId,
            option: option,
          },
        },
      },
      { new: true }
    );

    if (!updatedPoll) {
      console.log("Post not found");
    }

    res.json("success");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
