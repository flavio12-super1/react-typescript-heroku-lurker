import React from "react";
import Navbar from "./landingPageComponents/NavBar";
// import "../styles/LandingPage.css";
import "./landingPageComponents/LandingPage.css";

function LandingPage(props) {
  return (
    <div id="landingPage">
      <Navbar />
      <div id="container-one">
        <div id="inner-container-one">{props.page}</div>
      </div>
    </div>
  );
}

export default LandingPage;
