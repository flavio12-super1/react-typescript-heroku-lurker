import React from "react";
import Navbar from "./landingPageComponents/NavBar";
import "../styles/LandingPage.css";

function LandingPage(props) {
  return (
    <div id="landingPage">
      <Navbar />
      <div id="container-one">
        <div id="inner-container-one">
          {/* <h1>A place for Nerds</h1>
          <div id="description">
            Our mission is to give users full control of what content they
            decide to interact with, that includes your ads.
          </div> */}
          {props.page}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
