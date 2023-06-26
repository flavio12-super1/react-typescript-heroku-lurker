import React, { useState } from "react";
import "./Navbar.css";
import spider from "../../images/spider.png";
import "../../styles/CommonStyles.css";

const Navbar = () => {
  return (
    <div id="navContainer">
      <div className="displayFlex innerNavContainer">
        <div className="displayFlex alighnItemsCenter">
          <img src={spider} alt="" id="navIcon" />
          <div id="lurker">Lurker</div>
        </div>
        <div className="displayFlex buttonContainer alighnItemsCenter justifyContentCenter">
          <button>login</button>
          <div>|</div>
          <button>register</button>
        </div>
        <div className="displayFlex alighnItemsCenter justifyContentCenter">
          <button>open lurker</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
