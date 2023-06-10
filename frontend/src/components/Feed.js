import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../config/axiosConfig";
import "../styles/Feed.css"; // Import the CSS file for styling
import loadingImg from "./loading.gif";

const ReplyForm = ({ postId, parentReplyId, handleReplySubmit }) => {
  const [content, setContent] = useState("");

  const handleInputChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.post(
        `/userPosts/${postId}/replies`,
        {
          content,
          parentReplyId,
        }
      );

      handleReplySubmit(response.data);
      setContent("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reply-form">
      <input
        type="text"
        value={content}
        onChange={handleInputChange}
        placeholder="Enter reply content"
        className="reply-input"
      />
      <button type="submit" className="reply-button">
        Reply: {parentReplyId}
      </button>
    </form>
  );
};

const PostItem = ({
  post,
  handleReplySubmit,
  parentPostId = null,
  topLevelId = null,
}) => {
  return (
    <div className="post-item">
      <div>Post ID: {post.replyId}</div>
      {parentPostId && <div>Parent ID: {parentPostId}</div>}
      {topLevelId && <div>Top Level ID: {topLevelId}</div>}
      <div>Content: {post.content}</div>
      <ReplyForm
        postId={topLevelId || post.replyId} // Pass topLevelId or post._id as postId
        // parentReplyId={post._id} // Pass post._id as parentReplyId
        parentReplyId={post.replyId} // Pass post._id as parentReplyId
        handleReplySubmit={handleReplySubmit}
      />
      {post.replies &&
        post.replies.map((reply) => (
          <PostItem
            key={reply.replyId}
            post={reply}
            handleReplySubmit={handleReplySubmit}
            // parentPostId={post._id} // Pass the parent post ID to nested replies
            parentPostId={post.replyId} // Pass the parent post ID to nested replies
            topLevelId={topLevelId || post.replyId} // Pass topLevelId or post._id as topLevelId
          />
        ))}
    </div>
  );
};

const Feed = () => {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true); // Add hasMorePosts state
  const postListRef = useRef(null);

  const handleInputChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.post("/userPosts", { content });

      setPosts((prevPosts) => [response.data, ...prevPosts]);
      console.log(response.data);
      setContent("");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPosts = async () => {
    try {
      if (!hasMorePosts) return; // Stop making requests if no more posts
      setLoading(true);

      const response = await axiosInstance.get(
        `/userPosts?page=${page}&pageSize=10`
      );
      const newPosts = response.data.posts;
      console.log(newPosts);
      console.log(response.data.hasMorePosts);

      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setPage((prevPage) => prevPage + 1);
      setLoading(false);

      if (newPosts.length === 0) {
        setHasMorePosts(false); // Set hasMorePosts to false if no new posts are found
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = postListRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 10 && !loading) {
      fetchPosts();
    }
  };

  const handleReplySubmit = (newReply) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.replyId === newReply.postId) {
          // Ensure that the 'replies' array exists before pushing the new reply
          post.replies = post.replies || [];
          updateNestedReplies(post.replies, newReply);
        }
        return post;
      })
    );
  };

  const updateNestedReplies = (replies, newReply) => {
    for (const reply of replies) {
      if (reply.replyId === newReply.parentReplyId) {
        // Ensure that the 'replies' array exists before pushing the new nested reply
        reply.replies = reply.replies || [];
        reply.replies.push(newReply);
        return;
      }
      if (reply.replies) {
        updateNestedReplies(reply.replies, newReply);
      }
    }
  };

  return (
    <div className="feed-container">
      <div className="feed-inner-container">
        <form onSubmit={handleSubmit} className="post-form">
          <input
            type="text"
            value={content}
            onChange={handleInputChange}
            placeholder="Enter post content"
            className="post-input"
          />
          <button type="submit" className="post-button">
            Submit
          </button>
        </form>
        <h2 className="post-heading">Posts:</h2>
        <div className="post-list" onScroll={handleScroll} ref={postListRef}>
          <div>
            {posts.map((post) => (
              <PostItem
                key={post.replyId}
                post={post}
                handleReplySubmit={handleReplySubmit}
              />
            ))}
          </div>
        </div>
        {loading && (
          <div className="loading-animation">
            <img
              src={loadingImg}
              alt="Loading"
              style={{ width: "100px", height: "100px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
