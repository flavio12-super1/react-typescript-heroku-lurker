import React from "react";
import "./Conversation.css";
import axiosInstance from "../../../config/axiosConfig";
import { useNavigate } from "react-router-dom";

function Conversation({ currentlyViewing }) {
  let navigate = useNavigate();

  const startConversation = (userID) => {
    console.log("start conversation: " + userID);
    axiosInstance
      .post(`/getConversation`, {
        id: currentlyViewing?._id,
      })
      .then(async (response) => {
        console.log(response.data.channelID);
        navigate(`/lurker/channel/messages/${response.data.channelID}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div
      id="sendMessage"
      onClick={() => startConversation(currentlyViewing._id)}
    >
      <span className="material-icons">send</span>
    </div>
  );
}

export default Conversation;
