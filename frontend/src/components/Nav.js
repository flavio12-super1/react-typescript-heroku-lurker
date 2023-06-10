import React, { useContext, useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";
import { Link } from "react-router-dom";
import { UserContext } from "./Lurker";
import spider from "./lurker-icons/spider2.png";
import servers from "./lurker-icons/servers.png";
import groups from "./lurker-icons/groups.png";
import messages from "./lurker-icons/messages.png";
import explore from "./lurker-icons/explore.png";
import bell from "./lurker-icons/bell.png";
import profile from "./lurker-icons/profile.png";
import more from "./lurker-icons/more.png";
import "../styles/Nav.css";

function Nav() {
  const userData = useContext(UserContext);
  const { friendRequests, myEmail, uri } = userData;
  const [collaps, setCollaps] = useState(false);

  const handleLogout = async (event) => {
    event.preventDefault();

    try {
      axiosInstance
        .get(`${uri}/logout`)
        .then((res) => {
          localStorage.removeItem("token");
          window.location.replace(res.request.responseURL);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  function handleMore() {
    setCollaps(!collaps);
  }
  function closePopup() {
    setCollaps(false);
  }

  return (
    <div id="outerNavDiv">
      <div id="innerNavDiv">
        <nav>
          <div>
            <Link to="/lurker/" className="navStyle">
              <div className="divImg">
                <img
                  className="navIcons"
                  src="https://upload-image-demo-fh.s3.us-west-1.amazonaws.com/28ed1b7ba72c2599ee60bc7edaac7b3ae6344805346d68750311c3c5e3e4007b?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA53XOIF5EVVI62AN3%2F20230610%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Date=20230610T044252Z&X-Amz-Expires=604800&X-Amz-Signature=c81b15067ec2315ac8ad75131c2778d196ce491b29828aac665aae5a1da6f761&X-Amz-SignedHeaders=host&x-id=GetObject"
                  alt="spider"
                />
              </div>
            </Link>
          </div>
          <div className="octagon">
            <Link to="/lurker/channel/servers/" className="navStyle">
              <div className="rounded-button">
                <img className="octo-image" src={servers} alt="messages" />
              </div>
            </Link>
            <Link to="/lurker/channel/groups/" className="navStyle">
              <div className="rounded-button">
                <img className="octo-image" src={groups} alt="messages" />
              </div>
            </Link>
            <Link to="/lurker/channel/messages/" className="navStyle">
              <div className="rounded-button">
                <img className="octo-image" src={messages} alt="messages" />
              </div>
            </Link>
          </div>
          <div>
            <Link to="/lurker/explore" className="navStyle">
              <div className="divImg">
                <img className="navIcons" src={explore} alt="explore" />
              </div>
            </Link>
          </div>
          {/* start notifications */}
          <div>
            <Link to="/lurker/notifications" className="navStyle">
              <div className="divImg">
                <img className="navIcons bell" src={bell} alt="notifications" />
                {friendRequests.length > 0 ? (
                  <div id="notificationIcon">{friendRequests.length}</div>
                ) : null}
              </div>
            </Link>
          </div>
          {/* enednotifications  */}
          <div>
            <Link to={"/lurker/" + myEmail} className="navStyle">
              <div className="divImg">
                <img className="navIcons" src={profile} alt="profile" />
              </div>
            </Link>
          </div>
        </nav>
      </div>
      <div>
        <div onClick={handleMore} className="navStyle">
          <div className="divImg">
            <img className="navIcons" src={more} alt="more" />
          </div>
        </div>
      </div>
      <div id="popup">
        {collaps ? (
          <div>
            <div>
              <div id="backDrop" onClick={closePopup}></div>
            </div>
            <div id="moreOuterDiv">
              <div id="moreInnerDiv">
                <div className="moreOptionsDiv">
                  <div className="moreOptions">Settings</div>
                  <div className="moreOptions">Themes</div>
                </div>
                <div id="separator"></div>
                <div className="moreOptionsDiv">
                  <div className="moreOptions">Accounts</div>
                  <div className="moreOptions" onClick={handleLogout}>
                    Log Out
                  </div>
                </div>
              </div>
              <div id="moreArrow"></div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Nav;
