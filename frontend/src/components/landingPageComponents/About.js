import React, { useEffect, useState } from "react";
import axios from "axios";

function About() {
  const [containerArray, setContainerArray] = useState([]);

  useEffect(() => {
    // Fetch all tasks on component load
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/handleTasks/getTasks");
      setContainerArray(response.data.tasks);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(containerArray);
  }, [containerArray]);
  return (
    <div id="aboutLurkerContainer">
      <div id="aboutLurker">
        <div className="textOne">A place for Nerds</div>
        <div className="textTwo">
          Our mission is to give users full control of what content they decide
          to interact with, that includes your ads 👀
        </div>
      </div>

      <div id="reqOuterContainerDiv">
        <div className="reqOuterContainer">
          <div className="textOne">
            Want to help out? Things that need to be updated:
          </div>
          {containerArray?.map((container) => (
            <div className="reqContainer">
              <div className="textThree">{container.title}</div>
              <div className="reqContainerTexts">
                {container?.group.map((group) => (
                  <div>
                    <div className="textTwo">{group.title}</div>

                    <div className="containerText">
                      {group?.tasks.map((task) => (
                        <div className="indivText">{task.title}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
