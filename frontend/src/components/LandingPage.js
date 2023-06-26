import React from "react";
import Navbar from "./landingPageComponents/NavBar";
import "../styles/LandingPage.css";

function LandingPage() {
  return (
    <div>
      <Navbar />
      <div id="container-one">
        <div id="inner-container-one">
          <h1>A Place For Nerds</h1>
          <div id="description">
            Our mission is to give users full control of what content they
            decide to interact with, that includes your ads.
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
