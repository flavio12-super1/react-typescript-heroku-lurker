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
    });

    // Save the post
    await post.save();

    // Update the user's posts array with the new post ID at the start
    user.posts.unshift(post._id);
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

    // Retrieve the post IDs based on the startIndex and pageSize
    const postIds = user.posts.slice(startIndex, startIndex + pageSize);

    // Retrieve the posts based on the IDs and sort them in the order of the IDs
    const posts = await Post.find({ _id: { $in: postIds } }).sort({ _id: -1 });

    // Check if there are more posts available
    const hasMorePosts = user.posts.length > startIndex + pageSize;

    // Function to recursively retrieve nested replies for a reply
    const retrieveNestedReplies = async (reply) => {
      const nestedReplies = await Reply.find({ _id: { $in: reply.replies } });
      const nestedRepliesWithNested = await Promise.all(
        nestedReplies.map(async (nestedReply) => {
          const nestedReplies = await retrieveNestedReplies(nestedReply);
          return { ...nestedReply.toObject(), replies: nestedReplies };
        })
      );
      return nestedRepliesWithNested;
    };

    // Retrieve nested replies for each post
    const postsWithReplies = await Promise.all(
      posts.map(async (post) => {
        const replies = await Reply.find({ _id: { $in: post.replies } });
        const repliesWithNested = await Promise.all(
          replies.map(async (reply) => {
            const nestedReplies = await retrieveNestedReplies(reply);
            return { ...reply.toObject(), replies: nestedReplies };
          })
        );
        return { ...post.toObject(), replies: repliesWithNested };
      })
    );

    console.log(postsWithReplies);

    return res.json({ posts: postsWithReplies, hasMorePosts: hasMorePosts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
// router.get("/", async (req, res) => {
//   try {
//     // Retrieve the user from the database based on the user's ID
//     const user = await User.findById(req.userId); // Assuming you have the userId available in the request

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     let { page, pageSize } = req.query;
//     page = parseInt(page);
//     pageSize = parseInt(pageSize);

//     // Calculate the starting index based on the page and pageSize
//     const startIndex = (page - 1) * pageSize;

//     // Retrieve the post IDs based on the startIndex and pageSize
//     const postIds = user.posts.slice(startIndex, startIndex + pageSize);

//     // Retrieve the posts based on the IDs and sort them in the order of the IDs
//     const posts = await Post.find({ _id: { $in: postIds } }).sort({ _id: -1 });

//     // Check if there are more posts available
//     const hasMorePosts = user.posts.length > startIndex + pageSize;

//     // Function to recursively retrieve nested replies for a reply
//     const retrieveNestedReplies = async (reply, userMap) => {
//       const nestedReplies = await Reply.find({ _id: { $in: reply.replies } });
//       const nestedRepliesWithNested = await Promise.all(
//         nestedReplies.map(async (nestedReply) => {
//           const nestedUser = userMap.get(nestedReply.user.toString());
//           if (!nestedUser) {
//             const user = await User.findById(nestedReply.user);
//             userMap.set(nestedReply.user.toString(), user);
//             return { ...nestedReply.toObject(), user: user.toObject() };
//           }
//           return { ...nestedReply.toObject(), user: nestedUser.toObject() };
//         })
//       );
//       return nestedRepliesWithNested;
//     };

//     // Retrieve nested replies for each post
//     const userMap = new Map(); // Map to store user information
//     const postsWithReplies = await Promise.all(
//       posts.map(async (post) => {
//         const postUser = userMap.get(post.user.toString());
//         if (!postUser) {
//           const user = await User.findById(post.user);
//           userMap.set(post.user.toString(), user);
//           post.user = user.toObject();
//         } else {
//           post.user = postUser.toObject();
//         }

//         const replies = await Reply.find({ _id: { $in: post.replies } });
//         const repliesWithNested = await Promise.all(
//           replies.map(async (reply) => {
//             const nestedReplies = await retrieveNestedReplies(reply, userMap);
//             return { ...reply.toObject(), replies: nestedReplies };
//           })
//         );
//         return { ...post.toObject(), replies: repliesWithNested };
//       })
//     );

//     console.log(postsWithReplies);

//     return res.json({ posts: postsWithReplies, hasMorePosts: hasMorePosts });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

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

    // Create the new reply
    const newReply = new Reply({
      user: req.userId, // Assuming you have an authenticated user available
      content,
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

module.exports = router;
