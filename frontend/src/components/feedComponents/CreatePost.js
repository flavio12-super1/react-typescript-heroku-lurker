import React from "react";

function CreatePost({ handleSubmit, handleInputChange, content, self }) {
  return (
    <div>
      <div>
        <img src={self.theme?.imageURL} style={{ width: "55px" }} />
        <div>{self.userName}</div>
      </div>
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
    </div>
  );
}

export default CreatePost;
