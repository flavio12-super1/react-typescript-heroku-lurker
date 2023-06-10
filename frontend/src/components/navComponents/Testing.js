import React, { useRef, useEffect } from "react";

function Testing() {
  const messagesContainerRef = useRef(null);
  const editableContentRef = useRef(null);

  useEffect(() => {
    resizeEditableContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resizeEditableContent() {
    const messagesContainer = messagesContainerRef.current;
    const editableContent = editableContentRef.current;

    const containerHeight = messagesContainer.offsetHeight;
    const messagesHeight = messagesContainer.scrollHeight;

    if (messagesHeight > containerHeight) {
      const diff = messagesHeight - containerHeight;
      editableContent.style.bottom = `${diff}px`;
    } else {
      editableContent.style.bottom = "0";
    }
  }

  function handleInput() {
    resizeEditableContent();
  }

  return (
    <div className="container">
      <div className="messages" ref={messagesContainerRef}>
        <ul>
          <li>Message 1</li>
          <li>Message 2</li>
          <li>Message 3</li>
          {/* Add more messages as needed */}
        </ul>
      </div>
      <div
        className="editable-content"
        contentEditable="true"
        ref={editableContentRef}
        onInput={handleInput}
      ></div>
    </div>
  );
}

export default Testing;
