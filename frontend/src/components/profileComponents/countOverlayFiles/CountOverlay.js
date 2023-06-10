import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../config/axiosConfig";
import "./CountOverlay.css";

import { useNavigate } from "react-router-dom";

const UserList = ({ userCount, user, currentlyViewing, following }) => {
  console.log(userCount);

  const navigate = useNavigate();

  const handleUsernameClick = (userEmail) => {
    navigate(`/lurker/${userEmail}`);
  };

  const handleFollowButtonClick = (userID) => {
    // Function to handle the follow button click event
    console.log(`Follow user ${userID}`);
  };

  const checkIfFollowing = (userID, userEmail) => {
    if (user === userEmail) {
      return null;
    }

    const isFollowing = following.some((user) => user.userID === userID);

    if (isFollowing) {
      return (
        <button
          className="user-button user-button-following"
          onClick={() => handleFollowButtonClick(userID)}
        >
          <span className="material-icons">person</span>
        </button>
      );
    }

    return (
      <button
        className="user-button user-button-follow"
        onClick={() => handleFollowButtonClick(userID)}
      >
        <span className="material-icons">person_add</span>
      </button>
    );
  };

  return (
    <div className="user-list">
      {userCount?.map((user) => (
        <div className="user-card" key={user.userID}>
          <div className="user-info-actions">
            <div className="user-info-container">
              <div>
                <img
                  className="profile-image"
                  src={user.imageURL}
                  alt="Profile"
                />
              </div>
              <div
                className="username"
                onClick={() => handleUsernameClick(user.email)}
              >
                {user.email}
              </div>
            </div>
            <div className="height100">
              {checkIfFollowing(user.userID, user.email)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const CountOverlay = ({
  text,
  user,
  currentlyViewing,
  following,
  theme,
  count,
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [userCount, setUserCount] = useState(null);

  const overlayRef = useRef(null);

  const handleClickOutside = (e) => {
    if (overlayRef.current && !overlayRef.current.contains(e.target)) {
      setShowOverlay(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleColorPickerClick = () => {
    setShowOverlay(!showOverlay);
  };

  useEffect(() => {
    if (showOverlay) {
      axiosInstance
        .post(`/count/${text}`, {
          id: currentlyViewing?._id,
        })
        .then(async (response) => {
          setUserCount(response.data.friends);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [showOverlay]);

  useEffect(() => {
    if (userCount) {
      console.log(userCount);
    }
  }, [userCount]);

  return (
    <div
      className="outerCountElement"
      style={{
        zIndex: showOverlay ? "99" : "0",
      }}
    >
      <div
        className={
          showOverlay ? "showInnerCountElement" : "hideInnerCountElement"
        }
        style={{
          border: showOverlay
            ? `solid rgba(${theme?.borderColor.r}, ${theme?.borderColor.g}, ${theme?.borderColor.b}, ${theme?.borderColor.a})`
            : " solid #ffffff00",
          background: showOverlay
            ? `linear-gradient(rgba(${theme?.fg.r - 10}, ${theme?.fg.g - 10}, ${
                theme?.fg.b - 10
              }, 1), rgba(${theme?.fg.r}, ${theme?.fg.g}, ${theme?.fg.b}, 1))`
            : "none",
        }}
      >
        <div className="count">{count}</div>
        <div
          className="word"
          style={{
            color: `rgba(${theme?.ct.r}, ${theme?.ct.g}, ${theme?.ct.b}, ${theme?.ct.a})`,
          }}
        >
          <div ref={overlayRef} id="">
            <div
              className=""
              onClick={handleColorPickerClick}
              style={{ cursor: "pointer" }}
            >
              <div>{text}</div>
            </div>

            {showOverlay && (
              <div
                className="countOverlay"
                style={{
                  borderColor: `rgba(${theme?.borderColor.r}, ${theme?.borderColor.g}, ${theme?.borderColor.b}, ${theme?.borderColor.a})`,
                  background: showOverlay
                    ? `linear-gradient(rgba(${theme?.fg.r}, ${theme?.fg.g}, ${theme?.fg.b}, 1), rgba(${theme?.fg.r}, ${theme?.fg.g}, ${theme?.fg.b}, 0.15))`
                    : "none",
                }}
              >
                {userCount ? (
                  <UserList
                    userCount={userCount}
                    user={user}
                    currentlyViewing={currentlyViewing}
                    following={following}
                  />
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountOverlay;
