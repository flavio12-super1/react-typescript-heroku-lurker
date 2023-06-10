import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import styled, { keyframes } from "styled-components";
import { useParams } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import { UserContext } from "./Lurker";
import ColorPicker from "./profileComponents/colorPickerFiles/ColorPicker";
import ProfileImage from "./profileComponents/profileImageFiles/ProfileImage";
import UserBiography from "./profileComponents/bioFiles/UserBiography";
import CountOverlay from "./profileComponents/countOverlayFiles/CountOverlay";
import Conversation from "./profileComponents/conversationFiles/Conversation";
import "../styles/Profile.css";
export const ColorPickerContext = createContext();

function Profile() {
  const userData = useContext(UserContext);
  const {
    socket,
    myEmail,
    userID,
    friendsList,
    following,
    currentlyViewing,
    setCurrentlyViewing,
  } = userData;
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [overlay, setOverlay] = useState(false);
  const editProfile = () => {
    setOverlay(!overlay);
  };

  async function checkUserExists(user) {
    try {
      const response = await axiosInstance.post("/getUser", {
        email: username,
      });
      console.log(response.data.message);
      if (response.data.message === "success") {
        console.log("get user: " + JSON.stringify(response.data.user));
        setUser(user);
        setCurrentlyViewing(response.data.user);
        setTheme({
          bc: response.data.theme?.bc || { r: 28, g: 24, b: 38, a: 1 },
          fg: response.data.theme?.fg || { r: 42, g: 39, b: 62, a: 1 },
          bannerURL:
            response.data.theme?.bannerURL ||
            "https://www.primemotorz.com/wp-content/uploads/2019/08/secondary-banner-placeholder.jpg",
          bannerArray: response.data.theme?.bannerArray || [],
          imageURL:
            response.data.theme?.imageURL ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
          imageURLArray: response.data.theme?.imageURLArray || [],
          borderColor: response.data.theme?.borderColor || {
            r: 28,
            g: 24,
            b: 38,
            a: 1,
          },
          uc: response.data.theme?.uc || { r: 127, g: 255, b: 250, a: 1 },
          userBio:
            response.data.theme?.userBio ||
            "This is the start of a new journey filled with twists and turns 😊",
          bio: response.data.theme?.bio || { r: 255, g: 255, b: 255, a: 1 },
          ct: response.data.theme?.ct || { r: 147, g: 192, b: 255, a: 1 },
          dc: response.data.theme?.dc || { r: 211, g: 182, b: 52, a: 1 },
          bottomURL:
            response.data.theme?.bottomURL ||
            "https://clipartix.com/wp-content/uploads/2016/05/Grass-clipart-0.png",
          bottomURLArray: response.data.theme?.bottomURLArray || [],
        });
        return true;
      }
    } catch (error) {
      setUser(null);
      console.log(error);
      return false;
    }
  }

  useEffect(() => {
    if (user) {
      console.log("user: ", user);
    }
  }, [user]);

  useEffect(() => {
    if (currentlyViewing) {
      console.log("currently viewing user: ", JSON.stringify(currentlyViewing));
    }
  }, [currentlyViewing]);

  useEffect(() => {
    axiosInstance
      .post("/verify")
      .then(async (response) => {
        console.log(response.data.user);
        await checkUserExists(response.data.user.email);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [username]);

  useEffect(() => {
    if (theme) {
      console.log("theme: ", theme);
    }
  }, [theme]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const sendUnfollowRequest = (userID) => {
    socket.emit("unFollowUser", userID);
  };

  const followUser = (userID) => {
    socket.emit("followUser", userID);
  };

  const sendFollowRequest = () => {
    const data = {
      user: username,
      email: myEmail,
      userID: userID,
    };
    console.log(data);
    try {
      socket.emit("sendFollowRequest", data);
    } catch (err) {
      console.error(err);
    }
  };

  const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

  const OverlayContainer = styled.div`
    position: fixed;
    background-color: rgba(0, 0, 0, 0.8);
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const OverlayContent = styled.div`
    background-color: rgb(25 22 44);
    padding: 20px;
    color: white;
    height: -webkit-fill-available;
    width: -webkit-fill-available;
    margin: 40px;
    border: solid;
    animation: ${fadeIn} 0.3s ease;
    position: relative;
    display: flex;
    flex-direction: column;
  `;

  const UserEdits = ({ tempTheme, setTempTheme }) => {
    return (
      <div id="userEditsInnerContainer">
        <div>
          <div className="settingsOptionOuterDiv">
            <div className="settingsOptionInnerDiv">Background color: </div>
            <ColorPicker
              tempTheme={tempTheme}
              colorKey="bc"
              setTempTheme={setTempTheme}
            />
          </div>
          <div className="editDivider"></div>
        </div>
        {/* foreground color: */}
        <div>
          <div className="settingsOptionOuterDiv">
            <div className="settingsOptionInnerDiv">foreground Color: </div>
            <ColorPicker
              tempTheme={tempTheme}
              colorKey="fg"
              setTempTheme={setTempTheme}
            />
          </div>
          <div className="editDivider"></div>
        </div>
        {/* Banner image: */}
        <div>
          <div className="settingsOptionOuterDiv">
            <div className="settingsOptionInnerDiv">
              <ProfileImage
                tempTheme={tempTheme}
                text="Banner Image"
                id="bannerImage"
                uploadKey="bannerURL"
                uploadListKey="bannerArray"
                setTempTheme={setTempTheme}
              />
            </div>
          </div>
          <div className="editDivider"></div>
        </div>
        {/* Profile image: */}
        <div>
          <div className="settingsOptionOuterDiv">
            <div className="settingsOptionInnerDiv">
              <ProfileImage
                tempTheme={tempTheme}
                text="Profile Image"
                id="profileImage"
                uploadKey="imageURL"
                uploadListKey="imageURLArray"
                setTempTheme={setTempTheme}
              />
            </div>
          </div>
          <div className="editDivider"></div>
        </div>
        {/* Border color: */}
        <div>
          <div className="settingsOptionOuterDiv">
            <div className="settingsOptionInnerDiv">Border Color: </div>
            <ColorPicker
              tempTheme={tempTheme}
              colorKey="borderColor"
              setTempTheme={setTempTheme}
            />
          </div>
          <div className="editDivider"></div>
        </div>
        {/* Username color: */}
        <div>
          <div className="settingsOptionOuterDiv">
            <div className="settingsOptionInnerDiv">Username Color: </div>
            <ColorPicker
              tempTheme={tempTheme}
              colorKey="uc"
              setTempTheme={setTempTheme}
            />
          </div>
          <div className="editDivider"></div>
        </div>
        {/* User Bio: */}
        <div>
          <div className="settingsOptionOuterDivBio">
            <div className="settingsOptionInnerDivBio">
              <div className="settingsOptionInnerDiv">User Bio:</div>
              <ColorPicker
                tempTheme={tempTheme}
                colorKey="bio"
                setTempTheme={setTempTheme}
              />
            </div>
            <div className="bioText">
              <UserBiography
                tempTheme={tempTheme}
                setTempTheme={setTempTheme}
              />
            </div>
            {/* <UserBio /> */}
          </div>
          <div className="editDivider"></div>
        </div>
        {/* Count color: */}
        <div>
          <div className="settingsOptionOuterDiv">
            <div className="settingsOptionInnerDiv">Count Color: </div>
            <ColorPicker
              tempTheme={tempTheme}
              colorKey="ct"
              setTempTheme={setTempTheme}
            />
          </div>
          <div className="editDivider"></div>
        </div>
        {/* Divider color: */}
        <div>
          <div className="settingsOptionOuterDiv">
            <div className="settingsOptionInnerDiv">Divider Color: </div>
            <ColorPicker
              tempTheme={tempTheme}
              colorKey="dc"
              setTempTheme={setTempTheme}
            />
          </div>
          <div className="editDivider"></div>
        </div>
        {/* Bottom Image: */}
        <div>
          <div className="settingsOptionOuterDiv">
            <div className="settingsOptionInnerDiv">
              <ProfileImage
                tempTheme={tempTheme}
                text="Bottom Image"
                id="bottomImage"
                uploadKey="bottomURL"
                uploadListKey="bottomURLArray"
                setTempTheme={setTempTheme}
              />
            </div>
          </div>
          <div className="editDivider"></div>
        </div>
      </div>
    );
  };

  const Preview = ({ tempTheme }) => {
    return (
      <div
        id="previewContainer"
        style={{
          backgroundColor: `rgba(${tempTheme?.bc.r}, ${tempTheme?.bc.g}, ${tempTheme?.bc.b}, ${tempTheme?.bc.a})`,
        }}
      >
        <div
          id="preview"
          style={{
            backgroundColor: `rgba(${tempTheme?.fg.r}, ${tempTheme?.fg.g}, ${tempTheme?.fg.b}, ${tempTheme?.fg.a})`,
          }}
        >
          <div>
            <div
              alt="image"
              id="banner"
              style={{ backgroundImage: `url("${tempTheme.bannerURL}")` }}
            />
          </div>
          <div>
            <div id="profileImageDivOuter">
              <div id="profileImageDiv">
                <div
                  alt="image"
                  id="profileImage"
                  style={{
                    backgroundImage: `url("${tempTheme.imageURL}")`,
                    borderColor: `rgba(${tempTheme?.borderColor.r}, ${tempTheme?.borderColor.g}, ${tempTheme?.borderColor.b}, ${tempTheme?.borderColor.a})`,
                  }}
                />
              </div>
              <div
                id="editProfileBtn"
                style={{
                  borderColor: `rgba(${tempTheme?.borderColor.r}, ${tempTheme?.borderColor.g}, ${tempTheme?.borderColor.b}, ${tempTheme?.borderColor.a})`,
                }}
              >
                follow
              </div>
            </div>
            <div className="profileElement">
              <div
                id="usernameDiv"
                style={{
                  color: `rgba(${tempTheme?.uc.r}, ${tempTheme?.uc.g}, ${tempTheme?.uc.b}, ${tempTheme?.uc.a})`,
                }}
              >
                {username}
              </div>
            </div>
            <div className="profileElement">
              <div
                id="userBioDiv"
                style={{
                  color: `rgba(${tempTheme?.bio.r}, ${tempTheme?.bio.g}, ${tempTheme?.bio.b}, ${tempTheme?.bio.a})`,
                }}
              >
                {tempTheme?.userBio}
              </div>
            </div>
            <div className="profileElement countElement">
              <div className="hideInnerCountElement">
                <div className="count">0</div>
                <div
                  className="word"
                  style={{
                    color: `rgba(${tempTheme?.ct.r}, ${tempTheme?.ct.g}, ${tempTheme?.ct.b}, ${tempTheme?.ct.a})`,
                  }}
                >
                  followers
                </div>
              </div>

              <div className="hideInnerCountElement">
                <div className="count">0</div>
                <div
                  className="word"
                  style={{
                    color: `rgba(${tempTheme?.ct.r}, ${tempTheme?.ct.g}, ${tempTheme?.ct.b}, ${tempTheme?.ct.a})`,
                  }}
                >
                  following
                </div>
              </div>
            </div>
            <div
              id="media"
              style={{
                borderTop: `solid rgba(${tempTheme?.dc.r}, ${tempTheme?.dc.g}, ${tempTheme?.dc.b}, ${tempTheme?.dc.a})`,
              }}
            >
              No Posts, kinda sus 🤔
            </div>
          </div>
        </div>
        <div
          id="BottomImage"
          style={{
            backgroundImage: `url("${tempTheme.bottomURL}")`,
          }}
        ></div>
      </div>
    );
  };

  const ActionButtons = ({ saveEdits }) => {
    return (
      <div id="cross">
        <div id="saveBtn" onClick={saveEdits}>
          save
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="35"
          cursor="pointer"
          onClick={editProfile}
          viewBox="0 0 200 200"
        >
          <circle cx="100" cy="100" r="80" fill="red" />
          <g transform="rotate(45 100 100)">
            <line
              x1="60"
              y1="100"
              x2="140"
              y2="100"
              stroke="white"
              stroke-width="12"
            />
            <line
              x1="100"
              y1="60"
              x2="100"
              y2="140"
              stroke="white"
              stroke-width="12"
            />
          </g>
        </svg>
      </div>
    );
  };

  const OverLay = ({ theme }) => {
    console.log(theme);
    const [tempTheme, setTempTheme] = useState(theme);

    const saveEdits = async () => {
      axiosInstance
        .post("/saveEdits", {
          theme: tempTheme,
        })
        .then(async (response) => {
          console.log(response.data.theme);
          setOverlay(false);
          setTheme(response.data.theme);
          alert("Saved!");
        })
        .catch((error) => {
          console.log(error);
        });
    };
    return (
      <OverlayContainer>
        <OverlayContent>
          <div id="ActionButtonsConatiner">
            <ActionButtons saveEdits={saveEdits} />
          </div>
          <div id="profileEditContainer">
            <div id="userEditsContainer">
              <UserEdits tempTheme={tempTheme} setTempTheme={setTempTheme} />
            </div>
            <div id="previewOuterContainer">
              <Preview tempTheme={tempTheme} />
            </div>
          </div>
        </OverlayContent>
      </OverlayContainer>
    );
  };

  // const checkIfFollowing = () => {
  //   console.log(friendsList);
  //   if (friendsList.includes(username)) {
  //     return <div onClick={() => sendUnfollowRequest()}>unfollow</div>;
  //   }
  //   return <div onClick={() => sendFollowRequest()}>follow</div>;
  // };
  // const checkIfFollowing = () => {
  //   console.log(friendsList);
  //   console.log("currently following: " + following.userID);
  //   console.log("currently viewing: " + currentlyViewing._id);
  //   const isFollowing = friendsList.some((friend) => friend.email === username);

  //   if (isFollowing) {
  //     return <div onClick={() => sendUnfollowRequest()}>unfollow</div>;
  //   }

  //   // return <div onClick={() => sendFollowRequest()}>follow</div>;
  //   return <div onClick={() => followUser(currentlyViewing._id)}>follow</div>;
  // };
  const checkIfFollowing = () => {
    // console.log(friendsList);
    console.log("currently following: " + JSON.stringify(following));
    console.log("currently viewing: " + currentlyViewing._id);
    const isFollowing = following.some(
      (user) => user.userID === currentlyViewing._id
    );

    if (isFollowing) {
      return (
        <div onClick={() => sendUnfollowRequest(currentlyViewing._id)}>
          unfollow
        </div>
      );
    }

    // return <div onClick={() => sendFollowRequest()}>follow</div>;
    return <div onClick={() => followUser(currentlyViewing._id)}>follow</div>;
  };

  const OtherUser = () => {
    return (
      <div className="displayFlex">
        <Conversation currentlyViewing={currentlyViewing} />
        <div id="editProfileBtn">
          {/* <div onClick={() => sendFollowRequest()}>follow</div> */}
          {checkIfFollowing()}
        </div>
      </div>
    );
  };

  const ProfilePage = () => {
    return (
      <div
        id="profileOuterDiv"
        style={{
          backgroundColor: `rgba(${theme?.fg.r}, ${theme?.fg.g}, ${theme?.fg.b}, ${theme?.fg.a})`,
        }}
      >
        <div>
          <div
            alt="image"
            id="banner"
            style={{ backgroundImage: `url("${theme.bannerURL}")` }}
          />
        </div>
        <div>
          <div id="profileImageDivOuter">
            <div id="profileImageDiv">
              <div
                style={{
                  backgroundImage: `url("${theme.imageURL}")`,
                  borderColor: `rgba(${theme?.borderColor.r}, ${theme?.borderColor.g}, ${theme?.borderColor.b}, ${theme?.borderColor.a})`,
                }}
                alt=""
                id="profileImage"
              />
            </div>
            {user && user === username ? (
              <div
                id="editProfileBtn"
                onClick={editProfile}
                style={{
                  borderColor: `rgba(${theme?.borderColor.r}, ${theme?.borderColor.g}, ${theme?.borderColor.b}, ${theme?.borderColor.a})`,
                }}
              >
                edit profile
              </div>
            ) : (
              <OtherUser />
            )}
          </div>
          <div className="profileElement">
            <div
              id="usernameDiv"
              style={{
                color: `rgba(${theme?.uc.r}, ${theme?.uc.g}, ${theme?.uc.b}, ${theme?.uc.a})`,
              }}
            >
              {username}
            </div>
          </div>
          <div className="profileElement">
            <div
              id="userBioDiv"
              style={{
                color: `rgba(${theme?.bio.r}, ${theme?.bio.g}, ${theme?.bio.b}, ${theme?.bio.a})`,
              }}
            >
              {theme?.userBio}
            </div>
          </div>
          <div className="profileElement countElement">
            <CountOverlay
              text="followers"
              user={user}
              currentlyViewing={currentlyViewing}
              following={following}
              theme={theme}
              count={currentlyViewing.followers.length}
            />
            <CountOverlay
              user={user}
              text="following"
              currentlyViewing={currentlyViewing}
              following={following}
              theme={theme}
              count={currentlyViewing.following.length}
            />
          </div>
          <div
            id="media"
            style={{
              borderTop: `solid rgba(${theme?.dc.r}, ${theme?.dc.g}, ${theme?.dc.b}, ${theme?.dc.a})`,
            }}
          >
            No Posts, kinda sus 🤔
          </div>
        </div>
        {overlay ? <OverLay theme={theme} /> : null}
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: `rgba(${theme?.bc.r}, ${theme?.bc.g}, ${theme?.bc.b}, ${theme?.bc.a})`,
      }}
      id="profilePage"
    >
      <div id="profileOuterDiv">
        {user != null ? <ProfilePage /> : <div>This user does not exist</div>}
      </div>
      <div
        id="BottomImage"
        style={{
          backgroundImage: `url("${theme.bottomURL}")`,
        }}
      ></div>
    </div>
  );
}

export default Profile;
