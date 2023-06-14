import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../config/axiosConfig";
import "../styles/Feed.css"; // Import the CSS file for styling
import loadingImg from "./loading.gif";

const ReplyForm = ({ postId, parentReplyId, handleReplySubmit }) => {
  const [content, setContent] = useState("");

  const [poll, setPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState([]);
  const [newOption, setNewOption] = useState("");

  const handleOptionChange = (event, index) => {
    const updatedOptions = [...pollOptions];
    updatedOptions[index] = event.target.value;
    setPollOptions(updatedOptions);
  };

  const handleAddOption = () => {
    if (pollOptions.length >= 4) return; // Limit the number of options to 4
    setPollOptions([...pollOptions, newOption]);
    setNewOption("");
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = [...pollOptions];
    updatedOptions.splice(index, 1);
    setPollOptions(updatedOptions);
  };

  useEffect(() => {
    console.log(pollOptions);
  }, [pollOptions]);

  const handlePoll = () => {
    setPoll(!poll);
  };

  const handleInputChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log("pollOptions", pollOptions);
      const response = await axiosInstance.post(
        `/userPosts/${postId}/replies`,
        {
          content,
          parentReplyId,
          pollOptions,
        }
      );

      handleReplySubmit(response.data);
      setContent("");
      setPollOptions([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div>
        {poll ? (
          <div>
            <div className="poll-options">
              {pollOptions.map((option, index) => (
                <div key={index} className="poll-option">
                  <input
                    type="text"
                    value={option}
                    onChange={(event) => handleOptionChange(event, index)}
                    placeholder={`Option ${index + 1}`}
                    className="poll-input"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="remove-option"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {pollOptions.length < 4 && (
                <div className="add-option">
                  <input
                    type="text"
                    value={newOption}
                    onChange={(event) => setNewOption(event.target.value)}
                    placeholder="Add Option"
                    className="poll-input"
                  />
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="add-button"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
      <div>
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
        <button onClick={handlePoll}>add poll</button>
      </div>
    </div>
  );
};

const PostItem = ({
  post,
  handleReplySubmit,
  parentPostId = null,
  topLevelId = null,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleOptionClick = (option, postID, post) => {
    setSelectedOption(option);
    post.pollOption = option;

    // Make a request to the backend to update the poll option count
    // You can use the `axiosInstance` or any other HTTP client library
    // to send a request to the backend API and update the poll option count.
    // Example:
    axiosInstance.post(`/userPosts/${postID}/vote`, { option });
  };

  useEffect(() => {
    console.log(selectedOption);
  }, [selectedOption]);

  return (
    <div className="post-item">
      <div>
        <img src={post.user?.imageURL} style={{ width: "55px" }} />
      </div>
      <div>Creation Date: {post.createdAt}</div>
      <div>Username: {post.user?.username}</div>
      <div>Post ID: {post.replyId}</div>
      {parentPostId && <div>Parent ID: {parentPostId}</div>}
      {topLevelId && <div>Top Level ID: {topLevelId}</div>}
      <div>Content: {post.content}</div>
      {/* {post.pollOptions && post.pollOptions.length > 0 && (
        <div className="poll-options">
          {post.pollOptions.map((option, index) => (
            <div>
              {Object.values(option.options).map((optionValue, optionIndex) => (
                <div
                  key={index}
                  className={`poll-option${
                    selectedOption === optionValue ? " selected" : ""
                  }`}
                  onClick={() => handleOptionClick(optionValue, post.replyId)}
                >
                  <span key={optionIndex}>{optionValue}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )} */}
      {/* {Object.keys(post.voteCounts ?? {}).length > 0 && (
        <div className="poll-options">
          {Object.entries(post.voteCounts).map(([option, count]) => (
            <div
              key={option}
              className={`poll-option${
                selectedOption === option
                  ? " selected"
                  : "" || post.pollOption === option
                  ? " selected"
                  : ""
              }`}
              onClick={() => handleOptionClick(option, post.replyId, post)}
            >
              <span>{option}</span>
              <span className="count">{count}</span>
            </div>
          ))}
        </div>
      )} */}

      {Object.keys(post.voteCounts ?? {}).length > 0 && (
        <div className="poll-options">
          {Object.entries(post.voteCounts).map(([option, count]) => {
            const totalVotes = Object.values(post.voteCounts).reduce(
              (total, count) => total + count,
              0
            );
            const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;

            return (
              <div style={{ display: "flex" }}>
                <div style={{ width: "500px" }}>
                  <div
                    key={option}
                    className={`poll-option${
                      selectedOption === option || post.pollOption === option
                        ? " selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleOptionClick(option, post.replyId, post)
                    }
                    style={{ width: `${percentage}%`, height: "20px" }}
                  ></div>
                </div>
                <div>
                  <span>{option}</span>
                  <span className="count">({percentage.toFixed(1)}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showReplyForm && (
        <ReplyForm
          postId={topLevelId || post.replyId}
          parentReplyId={post.replyId}
          handleReplySubmit={handleReplySubmit}
        />
      )}
      <button onClick={toggleReplyForm}>
        {showReplyForm ? "Cancel" : "Reply"}
      </button>
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
