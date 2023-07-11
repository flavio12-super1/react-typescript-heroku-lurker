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
              - Redesign the current app logo, current logo has weird rendering
              artifacts. Lighting should be smoother
            </div>
            <div className="containerText">- one lowercase letter</div>
            <div className="containerText">- one digit</div>
            <div className="containerText">
              - and is at least 8 characters long
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
