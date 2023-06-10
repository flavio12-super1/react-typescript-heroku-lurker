import React, {
  useRef,
  useState,
  createContext,
  useEffect,
  useContext,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../Lurker";
import axiosInstance from "../../config/axiosConfig";
import "../../styles/Messages.css";
import "../../styles/Nav.css";
import gear from "../lurker-icons/gear.png";
import conversation from "../lurker-icons/conversation.png";
import binoculars from "../lurker-icons/binoculars.png";
import eye from "../lurker-icons/eye.png";
import eyecross from "../lurker-icons/eyecross.png";
import trash from "../lurker-icons/trash.png";

import Groups from "./Groups";
import FileUploades from "./FileUploades";

import SlateInput from "./SlateInput";
export const EventContext = createContext();

function Messages() {
  let navigate = useNavigate();
  const userData = useContext(UserContext);
  const { socket, myEmail, userID, friendsList } = userData;
  let { channelID } = useParams();
  channelID ??= null;
  const [room, setRoom] = useState({
    room: channelID,
    status: false,
    messageID: null,
  });
  const [chat, setChat] = useState([]);
  const [searchMessage, setSearchMessage] = useState("");
  const myRef = useRef(null);

  // useEffect(() => {
  //   setRoom({ room: channelID });
  // }, [channelID]);

  useEffect(() => {
    console.log("friendsList: " + JSON.stringify(friendsList));
  }, [friendsList]);

  const [selectedUser, setSelectedUser] = useState(null);

  //update room
  // useEffect(() => {
  //   if (room.room != null) {
  //     axiosInstance({
  //       method: "POST",
  //       data: {
  //         roomID: room.room,
  //       },
  //       withCredentials: true,
  //       url: "/getMessages",
  //     })
  //       .then((res) => {
  //         console.log("room" + channelID);
  //         console.log("status" + res.data.status);
  //         console.log("messageID" + res.data.messageID);
  //         setRoom({
  //           status: res.data.status,
  //           messageID: res.data.messageID,
  //           room: channelID,
  //         });
  //         socket.emit("joinRoom", room.room);
  //         console.log("joined: " + room.room + " successfuly");
  //       })
  //       .catch((err) => console.log(err));
  //   } else {
  //     console.log("user has joined no room");
  //   }
  // }, [channelID]);
  useEffect(() => {
    if (channelID != null) {
      axiosInstance({
        method: "POST",
        data: {
          roomID: channelID,
        },
        withCredentials: true,
        url: "/getMessages",
      })
        .then((res) => {
          console.log("room" + channelID);
          console.log("status" + res.data.status);
          console.log("messageID" + res.data.messageID);
          setRoom({
            status: res.data.status,
            messageID: res.data.messageID,
            room: channelID,
          });
          socket.emit("joinRoom", channelID);
          setChat(res.data.messages);
          console.log(res.data.messages);
          console.log("joined: " + channelID + " successfuly");
        })
        .catch((err) => console.log(err));
    } else {
      console.log("user has joined no room");
    }
    return () => {
      console.log(channelID);
      socket.emit("leaveRoom", channelID, () => {
        console.log("user has left room => : " + channelID);
        setChat([]);
      });
    };
  }, [channelID]);

  //check room state
  useEffect(() => {
    if (room.room != null) {
      console.log(room);
    } else {
      console.log("user has joined no room");
    }
  }, [room]);

  //json parse each message
  const parseMessage = (myMessage) => {
    myMessage = JSON.stringify(myMessage.children[0].text);
    if (myMessage.length > 2) {
      return JSON.parse(myMessage);
    }
    return <br />;
  };

  //render each message
  const renderChatMessages = (allMsg) => {
    return allMsg.map((msg, index) => (
      <div key={index}>
        <div>
          <div className="messageOuterDiv">
            <div className="messageDiv">{parseMessage(msg)}</div>
          </div>
        </div>
      </div>
    ));
  };

  //render images
  const renderDataImg = (allImg) => {
    return allImg.map((img, index) => (
      <div key={index}>
        <img src={img} className="myImage" alt="" />
      </div>
    ));
  };

  //render chat
  const renderChat = () => {
    return chat.map((data, index) => (
      <div key={index} className="messageContainer">
        <div>
          {data.images ? <div>{renderDataImg(data.images)}</div> : null}
          <div className="username">{data.username}</div>
          <div className="messageDiv">{renderChatMessages(data.message)}</div>
        </div>
      </div>
    ));
  };

  function updateChat(data) {
    setChat((chat) => [...chat, data]);
  }
  //recieve messages
  // useEffect(() => {
  //   socket.on("message", (data) => {
  //     console.log(data);
  //     updateChat(data);
  //   });
  // }, []);

  // useEffect(() => {
  //   socket.on("message", (data) => {
  //     console.log(data);
  //     updateChat(data);
  //   });
  // }, [channelID]);
  useEffect(() => {
    const handleMessage = (data) => {
      console.log(data);
      updateChat(data);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [channelID]);

  const chatContainerRef = useRef(null);
  const [userScrolledToBottom, setUserScrolledToBottom] = useState(1);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    const handleScroll = (e) => {
      const { scrollTop, clientHeight, scrollHeight } = chatContainer;
      const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
      if (isAtBottom) {
        console.log("user scrolled to bottom");
        setUserScrolledToBottom(1);
      } else {
        console.log("user scrolling");
        setUserScrolledToBottom(0);
      }
      if (!isAtBottom) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    chatContainer?.addEventListener("scroll", handleScroll);

    return () => {
      chatContainer?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const chatContainer = chatContainerRef?.current;
    if (chatContainer) {
      const { scrollHeight, clientHeight } = chatContainer;

      if (userScrolledToBottom == 1) {
        chatContainer.scrollTo({
          top: scrollHeight - clientHeight,
          behavior: "smooth",
        });
      } else {
        console.log("pain");
      }
    }
  }, [chat]);

  const handleScrollToBottom = () => {
    console.log("scrolling to the bottom when shift enter pressed");
    myRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  const handleKeyPress = (event) => {
    const chatContainer = chatContainerRef.current;
    const { scrollHeight, clientHeight } = chatContainer;
    // console.log(scrollHeight);
    // console.log(clientHeight);
    // console.log("key enter pressed");
  };

  useEffect(() => {
    console.log("scroll updated");
    if (userScrolledToBottom == 1) {
      console.log("user scrolled to bottom");
    } else if (userScrolledToBottom == 0) {
      console.log("user scrolling");
    }
  }, [userScrolledToBottom]);

  //send message
  const onMessageSubmit = async (messages) => {
    if (files.length > 0) {
      const formData = new FormData();
      formData.append("image", files[0]);
      await axiosInstance.post("/api/posts", formData).then((res) => {
        console.log(res.data);

        console.log(messages);
        const data = {
          images: [res.data],
          message: messages,
          channelID: channelID,
          status: room.status,
          messageID: room.messageID,
        };
        setRoom((prevState) => ({
          ...prevState,
          status: false,
        }));
        socket.emit("message", data);
      });
    } else {
      console.log(messages);
      const data = {
        message: messages,
        channelID: channelID,
        status: room.status,
        messageID: room.messageID,
      };
      //here
      setRoom((prevState) => ({
        ...prevState,
        status: false,
      }));
      socket.emit("message", data);
    }
  };

  const handleNavigate = (channelID) => {
    socket.emit("leaveRoom", room.room, () => {
      // Callback function called when the "leaveRoom" event is acknowledged
      setChat([]);
      // Navigate to the new room
      navigate("/lurker/channel/messages/" + channelID);
    });
  };
  const navigateToProfile = (email) => {
    navigate("/lurker/" + email);
  };
  //render friend list
  // const renderFriendList = () => {
  //   return friendsList.map((data, index) => (
  //     <div key={index} id="">
  //       <div className="">
  //         {/* <img src={data.imageURL} alt="" style={{ width: "55px" }} /> */}

  //         <img
  //           src={data.imageURL}
  //           alt=""
  //           style={{ width: "55px", display: "block" }}
  //         />

  //         <button className="" onClick={() => handleNavigate(data.channelID)}>
  //           {data.email}
  //         </button>
  //       </div>
  //     </div>
  //   ));
  // };
  // Render friend list
  const renderFriendList = () => {
    return friendsList.map((data, index) => {
      // Check if the channelID matches the channelId from URL params
      const isSelected = data.channelID === channelID;

      return (
        <div key={index} id="">
          <div className="">
            {/* <img src={data.imageURL} alt="" style={{ width: "55px" }} /> */}
            <img
              src={data.imageURL}
              alt=""
              style={{
                width: "55px",
                display: "block",
                border: isSelected ? "2px solid blue" : "none",
              }}
            />
            <button className="" onClick={() => handleNavigate(data.channelID)}>
              {data.email}
            </button>
          </div>
        </div>
      );
    });
  };

  useEffect(() => {
    // Find the user object that matches the selected channelID
    const selectedUser = friendsList.find(
      (data) => data.channelID === channelID
    );
    setSelectedUser(selectedUser);
  }, [friendsList, channelID]);

  useEffect(() => {
    console.log("selected user: " + JSON.stringify(selectedUser));
  }, [selectedUser]);

  //handle image uploads
  const [files, setFiles] = useState([]);
  const handlePaste = (event) => {
    const clipboardItems = Array.from(event.clipboardData.items);

    // Check if there is a file in the clipboardItems
    const hasFileInClipboard = clipboardItems.some(
      (item) => item.kind === "file"
    );

    clipboardItems.forEach((item) => {
      if (item.kind === "file") {
        const file = item.getAsFile();
        console.log(file);
        setFiles((prevFiles) => [...prevFiles, file]);
      } else if (item.kind === "string" && !hasFileInClipboard) {
        item.getAsString((text) => {
          // Process the pasted text as needed

          if (text.substring(0, 5) === "https") {
            console.log("Pasted text:", text);
            setFiles((prevFiles) => [...prevFiles, text]);
          }
        });
      }
    });
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const dataTransfer = event.dataTransfer;

    if (dataTransfer.items) {
      const droppedFiles = Array.from(dataTransfer.items)
        .filter((item) => item.kind === "file")
        .map((item) => item.getAsFile());

      setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    } else {
      const droppedFiles = Array.from(dataTransfer.files);

      setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    }

    const imageUrl = event.dataTransfer.getData("text/html");
    const rex = /src="?([^"\s]+)"?\s*/;
    const url = rex.exec(imageUrl);
    const cleanedUrl = url[1].replace(/&amp;/g, "&"); // Remove all occurrences of '&amp;'
    console.log(cleanedUrl);
    setFiles((prevFiles) => [...prevFiles, cleanedUrl]);
  };

  const handleFileUpload = async (onMessageSubmit) => {
    const formData = new FormData();
    formData.append("image", files[0]);
    await axiosInstance.post("/api/posts", formData).then((res) => {
      console.log(res.data);
      onMessageSubmit(onMessageSubmit);
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", event.target.src);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
  };

  const handleDragOverImage = (event) => {
    event.preventDefault();
  };

  const handleDropImage = (event) => {
    event.preventDefault();
    const imageUrl = event.dataTransfer.getData("text/plain");
    setFiles((prevFiles) => [...prevFiles, imageUrl]);
  };

  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            file.type,
            0.7
          );
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const compressedFiles = await Promise.all(uploadedFiles.map(compressImage));

    setFiles((prevFiles) => [...prevFiles, ...compressedFiles]);
  };

  return (
    <div
      id="messagesOuterDiv"
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onKeyDown={(event) => handleKeyPress(event)}
    >
      <div id="messagesNavContainer">
        <div id="searchMessages">
          <div className="messagesNavElements">
            <div className="navStyle">
              <div className="divImg">
                <div id="conversationBtn">
                  <div>Find A Conversation</div>
                  <img
                    id="navSmallIcon"
                    src={conversation}
                    alt="conversation"
                  />
                </div>
              </div>
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
        <div style={{ display: "flex" }}>
          <div id="messagesNavSearch">
            <div id="messagesNavSearchDiv">
              <input
                id="messagesNavSearchDivInput"
                value={searchMessage}
                onChange={(e) => setSearchMessage(e.target.value)}
                placeholder="search messages"
              />
            </div>
            <div id="messagesNavIconDiv">
              <img id="messagesNavIconDivImage" src={binoculars} alt="spider" />
            </div>
          </div>
          <div className="navSettingsStyle">
            <div className="divImg">
              <img className="navIcons" src={gear} alt="spider" />
            </div>
          </div>
        </div>
      </div>
      {/* binoculars.png */}
      <div id="messagesInnerDivContainer">
        <div id="messagesInnerDiv">
          <div id="messagesInnerDivLeft">
            <div>{renderFriendList()}</div>
          </div>

          {channelID != null ? (
            <div id="chatDiv">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  borderBottom: "solid black",
                }}
              >
                <div>
                  <img
                    src={selectedUser?.imageURL}
                    alt=""
                    style={{ width: "100px" }}
                  />
                  <div>
                    profile name (might allow users to create profiles names){" "}
                  </div>
                  <button
                    onClick={() => navigateToProfile(selectedUser?.email)}
                  >
                    view profile
                  </button>
                </div>
              </div>
              <div id="chatMessagesDiv" ref={chatContainerRef}>
                <div style={{ overflowAnchor: "none" }}>
                  <div>
                    {renderChat()}
                    <div ref={myRef}></div>
                  </div>
                </div>
              </div>
              <div id="outerSlateDiv">
                <div style={{ flexGrow: "1" }}>
                  <div id="imageContainer">
                    {files.map((file, index) => (
                      <div key={index}>
                        {typeof file === "string" ? (
                          <div
                            className="innerImageContainer"
                            style={
                              file.substring(0, 5) === "https"
                                ? { border: "dotted red 4px" }
                                : { border: "dotted black" }
                            }
                          >
                            <img
                              src={file}
                              alt={`Image url`}
                              style={{
                                maxWidth: "190px",
                                maxHeight: "190px",
                              }}
                              draggable="true"
                              onDragStart={handleDragStart}
                              onDragEnter={handleDragEnter}
                              onDragLeave={handleDragLeave}
                              onDragOver={handleDragOverImage}
                              onDrop={handleDropImage}
                            />
                          </div>
                        ) : (
                          <div
                            className="innerImageContainer"
                            style={{ border: "solid black" }}
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              style={{
                                maxWidth: "190px",
                                maxHeight: "190px",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div id="inputOuterContainer">
                    <div style={{ flexGrow: "1" }}>
                      <EventContext.Provider
                        value={{
                          room,
                          setFiles,
                        }}
                      >
                        <SlateInput onMessageSubmit={onMessageSubmit} />
                      </EventContext.Provider>
                    </div>
                    <div id="imgButtonDiv">
                      <input
                        type="file"
                        name="image-upload"
                        id="input"
                        multiple
                        onChange={handleFileChange}
                      />
                      <div id="labelDiv">
                        <label htmlFor="input" className="image-upload">
                          <i className="material-icons">add_photo_alternate</i>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              no channel selected : (
              <Groups />
              <FileUploades />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
