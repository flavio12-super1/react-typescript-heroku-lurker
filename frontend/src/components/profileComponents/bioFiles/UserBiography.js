import React, { useEffect, useMemo, useState, useRef } from "react";
import "./UserBiography.css";

function UserBiography({ tempTheme, setTempTheme }) {
  const textareaRef = useRef(null);
  const [emojiData] = useState([
    { emoji: "😀", name: "grinning_face" },
    { emoji: "😃", name: "grinning_face_with_big_eyes" },
    { emoji: "😄", name: "grinning_face_with_smiling_eyes" },
    { emoji: "😊", name: "smiling_face_with_smiling_eyes" },
    { emoji: "😎", name: "smiling_face_with_sunglasses" },
    { emoji: "😍", name: "smiling_face_with_heart_eyes" },
    { emoji: "🙂", name: "slightly_smiling_face" },
    { emoji: "🤩", name: "star-struck" },
    { emoji: "😋", name: "face_savoring_food" },
    { emoji: "😉", name: "winking_face" },
    { emoji: "😆", name: "grinning_squinting_face" },
    { emoji: "😁", name: "grinning_face_with_smiling_eyes" },
    { emoji: "😘", name: "face_blowing_a_kiss" },
    { emoji: "🥰", name: "smiling_face_with_hearts" },
    { emoji: "😗", name: "kissing_face" },
    { emoji: "😙", name: "kissing_face_with_smiling_eyes" },
    { emoji: "😚", name: "kissing_face_with_closed_eyes" },
    { emoji: "😛", name: "face_with_tongue" },
    { emoji: "😜", name: "winking_face_with_tongue" },
    { emoji: "🤪", name: "zany_face" },
    { emoji: "🤨", name: "face_with_raised_eyebrow" },
    { emoji: "🧐", name: "face_with_monocle" },
    { emoji: "🤓", name: "nerd_face" },
    { emoji: "😝", name: "squinting_face_with_tongue" },
    // Add more emojis here...
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmojis, setFilteredEmojis] = useState(emojiData);

  const handleSearch = (event) => {
    const { value } = event.target;
    const formattedValue = value.replace(/_/g, " ").replace(/\s+/g, "_");
    setSearchTerm(formattedValue);

    const filteredEmojis = emojiData.filter((emoji) =>
      emoji.name.includes(formattedValue.toLowerCase())
    );
    setFilteredEmojis(filteredEmojis);
  };

  const insertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    const { selectionStart, selectionEnd, value } = textarea;
    const updatedValue =
      value.substring(0, selectionStart) +
      emoji +
      value.substring(selectionEnd);
    textarea.value = updatedValue;

    // Set the cursor position after the inserted emoji
    const cursorPosition = selectionStart + emoji.length;
    textarea.setSelectionRange(cursorPosition, cursorPosition);

    // Trigger the input event to update any event listeners or bindings
    const event = new Event("input", { bubbles: true });
    textarea.dispatchEvent(event);

    setTempTheme((prevState) => ({
      ...prevState,
      userBio: updatedValue,
    }));

    // Set focus to the textarea
    textarea.focus();
  };

  const handleKeyUp = (event) => {
    const { value } = event.target;

    setTempTheme((prevState) => ({
      ...prevState,
      userBio: value,
    }));
  };

  return (
    <div className="displayFlex" style={{ minHeight: "160px" }}>
      <textarea ref={textareaRef} id="textAreaBio" onKeyUp={handleKeyUp}>
        {tempTheme?.userBio}
      </textarea>
      <div className="emoji-picker">
        <input
          type="text"
          placeholder="Search Emoji by Name"
          style={{ backgroundColor: "#181624" }}
          value={searchTerm}
          onChange={handleSearch}
        />

        <div className="emoji-container">
          {filteredEmojis.map((emoji, index) => (
            <div
              className="emoji"
              key={index}
              title={emoji.name}
              onClick={() => insertEmoji(emoji.emoji)}
            >
              {emoji.emoji}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserBiography;
