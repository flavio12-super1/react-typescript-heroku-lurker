import axios from "axios";
import "../styles/Lurker.css";
import { useParams, useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect } from "react";
import { createContext } from "react";
import SocketContext from "../config/SocketContext";
import axiosInstance from "../config/axiosConfig";
import Nav from "./Nav";
export const UserContext = createContext();

function Lurker(props) {
  let { channelID } = useParams();
  channelID ??= null;
  const userData = useContext(SocketContext);

  const { socket, uri } = userData;
  const [count, SetCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [friendRequests, setFriendRequest] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [following, setFollowing] = useState([]);
  const [currentlyViewing, setCurrentlyViewing] = useState(null);
  const myEmail = localStorage.getItem("email");
  const userID = localStorage.getItem("userID");

  const [self, setSelf] = useState(false);

  let navigate = useNavigate();
  console.log("reloaded lurker.js");
  useEffect(() => {
    const handleFriendReuest = (data) => {
      alert("Friend request from" + data.email);
      console.log(data);
      setFriendRequest((notification) => [data, ...notification]);
      SetCount((prevCount) => prevCount + 1);
    };
    const handleFriendRequestAccepted = (data) => {
      console.log(data);
      setFriendsList((friends) => [data, ...friends]);
      socket.emit("addChannel", data.channelID);
      alert("channel id: " + data.channelID);

      navigate("/lurker/channel/messages/" + data.channelID);
    };
    const handleSuccessFollowUpdate = (following) => {
      console.log("success follow: " + userID);

      setFollowing(following);
    };
    const handleUpdateCurrentlyViewingFollowers = (followers) => {
      setCurrentlyViewing((prevState) => ({
        ...prevState,
        followers: followers,
      }));
    };
    const handleNewChannel = (newChannel) => {
      setFriendsList((prevState) => [newChannel, ...prevState]);
    };
    socket.on("successFollowUpdate", handleSuccessFollowUpdate);
    socket.on(
      "updateCurrentlyViewingFollowers",
      handleUpdateCurrentlyViewingFollowers
    );
    socket.on("friendRequest", handleFriendReuest);
    socket.on("friendRequestAccepted", handleFriendRequestAccepted);
    socket.on("newChannel", handleNewChannel);

    return () => {
      socket.removeAllListeners();
    };
  }, [socket]);

  useEffect(() => {
    axiosInstance
      .post(`${uri}/userData`)
      .then((response) => {
        console.log(response);
        setSelf(response.data);
        setFriendRequest((notification) => [
          ...response.data.notifications.map((user) => ({
            email: user.email,
            id: user.id,
            userID: user.userID,
            imageURL: user.imageURL,
          })),
          ...notification,
        ]);
        setFriendsList(
          response.data.channels.map((user) => ({
            email: user.email,
            id: user.id,
            userID: user.userID,
            imageURL: user.imageURL,
            channelID: user.channelID,
          }))
        );
        console.log(response.data.following);
        setFollowing(response.data.following);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [channelID]);

  useEffect(() => {
    console.log("following: " + JSON.stringify(following));
  }, [following]);

  function denyRequest(id) {
    let filteredArray = friendRequests.filter((item) => item.id !== id);
    setFriendRequest(filteredArray);
    const data = {
      id: id,
    };
    socket.emit("denyFriendRequest", data);
    alert("friend request denied: " + id);
  }

  function acceptRequest(id, userID) {
    const data = {
      id: id,
      userID: userID,
    };
    socket.emit("acceptRequest", data);
    let filteredArray = friendRequests.filter((item) => item.id !== id);
    setFriendRequest(filteredArray);
    alert("friend request accepted: " + userID);
  }

  return (
    <div id="lurkerContainer">
      <UserContext.Provider
        value={{
          count,
          myEmail,
          userID,
          socket,
          uri,
          notifications,
          friendRequests,
          friendsList,
          following,
          currentlyViewing,
          setCurrentlyViewing,
          denyRequest,
          acceptRequest,
          self,
        }}
      >
        <Nav />
        <div id="lurkerPage">{props.page}</div>
      </UserContext.Provider>
    </div>
  );
}

export default Lurker;
