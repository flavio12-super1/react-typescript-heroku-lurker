import React from "react";

function About() {
  return (
    <div>
      <div className="textOne">A place for Nerds</div>
      <div className="textTwo">
        Our mission is to give users full control of what content they decide to
        interact with, that includes your ads.
      </div>

      <div>
        <div className="reqOuterContainer">
          <div className="textTwo">
            Want to help out? Things that need to be updated:
          </div>
          <div className="reqContainer">
            <div className="containerText">
              <div className="indivText">
                - Redesign the current app logo, current logo has weird
                rendering artifacts. Lighting should be smoother
              </div>
            </div>
            <div className="containerText">
              <div className="indivText">
                -Add animation to side bar on landing page when opening and
                closing it from the side (currently the right side).
              </div>
              <div className="indivText">
                - Add a trigger event that closes the side nav when you click
                outsite of it.
              </div>
            </div>
            <div className="containerText">
              <div className="indivText">- one digit</div>
            </div>
            <div className="containerText">
              <div className="indivText">
                - and is at least 8 characters long
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
