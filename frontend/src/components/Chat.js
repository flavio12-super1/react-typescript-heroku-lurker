import axios from "axios";
import "../styles/Lurker.css";
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "./Lurker";
import { useNavigate } from "react-router-dom";

function Chat() {
  const userData = useContext(UserContext);
  const { socket, myEmail } = userData;
  const [roomName, setRoomName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const createRoom = () => {
    console.log("creating new room");
    try {
      socket.emit("createRoom", roomName);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = () => {
    console.log("sending message to: " + email);
    const data = {
      senderEmail: myEmail,
      email: email,
      message: message,
    };
    try {
      socket.emit("sendMessage", data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleRoomCreated = (roomID) => {
      alert("room created: " + roomID);
      console.log(roomID);
    };

    socket.on("roomID", handleRoomCreated);

    return () => {
      socket.off("roomID");
    };
  }, [socket]);

  let navigate = useNavigate();

  function handleClick() {
    navigate("/lurker/notifications");
  }

  return (
    <div>
      <div>Chat</div>
      <div>
        <button onClick={handleClick}>notifications</button>
      </div>
      {myEmail}

      <div className="inputStyle">
        <span>name: </span>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
      </div>
      <button onClick={() => createRoom()}>create room</button>

      <div className="inputStyle">
        <span>email: </span>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="inputStyle">
        <span>message: </span>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button onClick={() => sendMessage()}>send</button>
    </div>
  );
}

export default Chat;
