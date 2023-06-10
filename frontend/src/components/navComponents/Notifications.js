import React, { useState, useContext } from "react";
import { UserContext } from "../Lurker";
import { useNavigate } from "react-router-dom";
import "../../styles/Messages.css";
import "../../styles/Notifications.css";
import "../../styles/Nav.css";
import gear from "../lurker-icons/gear.png";
import binoculars from "../lurker-icons/binoculars.png";
import eye from "../lurker-icons/eye.png";
import eyecross from "../lurker-icons/eyecross.png";
import trash from "../lurker-icons/trash.png";

function Notifications() {
  let navigate = useNavigate();
  const userData = useContext(UserContext);
  const [searchNotification, setsearchNotification] = useState("");

  const { notifications, friendRequests, denyRequest, acceptRequest } =
    userData;

  const handleNavigate = (username) => {
    navigate("/lurker/" + username);
  };

  const renderNotifications = () => {
    return notifications.map((data, index) => (
      <div key={index} className="">
        <div className="btn">
          Message from: {data.senderEmail} {`->`}
        </div>
        <div className="btn">{data.message}</div>
      </div>
    ));
  };
  const renderFriendRequests = () => {
    return friendRequests.map((data, index) => (
      <div key={index} id="notificationOuterDiv">
        <div className="notificationInformation">
          Friend request from: {data.userID}
          <img
            src={data.imageURL}
            alt="imageURL"
            className="friendRequestImageURL"
          />
          <button
            className="notificationEmailBtn"
            onClick={() => handleNavigate(data.email)}
          >
            {data.email}
          </button>
        </div>
        <div className="notificationOptions">
          <button
            className="notificationAcceptBtn"
            onClick={() => acceptRequest(data.id, data.userID)}
          >
            ✓
          </button>
          <button
            className="notificationDenyBtn"
            onClick={() => denyRequest(data.id)}
          >
            x
          </button>
        </div>
      </div>
    ));
  };
  return (
    <div id="notificationsPage">
      <div id="messagesNavContainer">
        <div id="searchMessages">
          <div id="messagesNavSearch">
            <div id="messagesNavSearchDiv">
              <input
                id="notificationsNavSearchDivInput"
                value={searchNotification}
                onChange={(e) => setsearchNotification(e.target.value)}
                placeholder="search notifications"
              />
            </div>
            <div id="messagesNavIconDiv">
              <img id="messagesNavIconDivImage" src={binoculars} alt="spider" />
            </div>
          </div>
          <div className="messagesNavElements">
            <div className="navStyle">
              <div className="divImg">
                <img className="navIcons" src={eye} alt="eye" />
              </div>
            </div>
          </div>
          <div className="messagesNavElements">
            <div className="navStyle">
              <div className="divImg">
                <img className="navIcons" src={eyecross} alt="eyecross" />
              </div>
            </div>
          </div>
          <div className="messagesNavElements">
            <div className="navStyle">
              <div className="divImg">
                <img className="navIcons" src={trash} alt="trash" />
              </div>
            </div>
          </div>
        </div>
        <div className="navStyle">
          <div className="divImg"></div>
        </div>
        <div>
          <div className="navStyle">
            <div className="divImg">
              <img className="navIcons" src={gear} alt="spider" />
            </div>
          </div>
        </div>
      </div>
      {/* binoculars.png */}
      <div id="messagesInnerDivContainer">
        <div id="notificationsInnerDiv">
          <div>{renderNotifications()}</div>
          <div>{renderFriendRequests()}</div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
