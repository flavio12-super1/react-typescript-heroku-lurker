import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/App.css";

import SocketContext from "./config/SocketContext";
import io from "socket.io-client";
import axios from "./config/axiosConfig";

import LandingPage from "./components/LandingPage";
import About from "./components/landingPageComponents/About";
import Login from "./components/landingPageComponents/Login";

import Register from "./components/landingPageComponents/Register";
import Lurker from "./components/Lurker";
import Feed from "./components/Feed";
import Chat from "./components/Chat";
import Notifications from "./components/navComponents/Notifications";
import Profile from "./components/Profile";
import Explore from "./components/navComponents/Explore";
import Channels from "./components/navComponents/Channels";
import Messages from "./components/navComponents/Messages";

import Testing from "./components/navComponents/Testing";

const socket = io({
  auth: {
    token: localStorage.getItem("token"),
  },
});

function App() {
  //check for url
  var currentUrl = window.location.href;
  var partStr = currentUrl.slice(0, 5);
  var uri = "";
  if (partStr === "https") {
    uri = "https://react-nodejs-heroku-public.herokuapp.com";
  } else {
    uri = "http://localhost:8000";
  }
  console.log(uri);

  axios.defaults.baseURL = uri;
  console.log("reloaded app.tsx");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket is connected");
    });
    socket.on("disconnect", (reason) => {
      console.log("socket is disconnected: " + reason);
    });
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
      // alert("connect_error due to invalid_token");
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <div className="appContainer">
      <SocketContext.Provider value={{ socket, uri }}>
        <Routes>
          <Route path="/" element={<LandingPage page={<About />} />} />
          <Route
            path="/register"
            element={<LandingPage page={<Register />} />}
          />
          <Route path="/login" element={<LandingPage page={<Login />} />} />
          <Route path="/lurker" element={<Lurker page={<Feed />} />} />
          <Route
            path="/lurker/explore"
            element={<Lurker page={<Explore />} />}
          />

          <Route
            path="/lurker/notifications"
            element={<Lurker page={<Notifications />} />}
          />
          <Route
            path="/lurker/:username"
            element={<Lurker page={<Profile />} />}
          />
          <Route
            path="/lurker/channel/server/"
            element={<Lurker page={<Channels />} />}
          />
          <Route
            path="/lurker/channel/server/:channelID"
            element={<Lurker page={<Channels />} />}
          />
          <Route
            path="/lurker/channel/messages/"
            element={<Lurker page={<Messages />} />}
          />
          <Route
            path="/lurker/channel/messages/:channelID"
            element={<Lurker page={<Messages />} />}
          />
          <Route
            path="/lurker/channel/groups/"
            element={<Lurker page={<Testing />} />}
          />
        </Routes>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
