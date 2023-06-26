import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import spider from "../../images/spider.png";
import "../../styles/CommonStyles.css";
import more from "../lurker-icons/more.png";

const Navbar = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const handleMore = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  return (
    <div id="navContainer">
      <div className="displayFlex innerNavContainer justifyContentSpaceBetween">
        <div className="displayFlex alighnItemsCenter">
          <img src={spider} alt="" id="navIcon" />
          <div id="lurker">Lurker</div>
        </div>
        <div
          className="displayFlex buttonContainer alighnItemsCenter justifyContentCenter"
          id="navButtonsContainer"
        >
          <Link to="/login" className="navLink">
            <div className="">Login</div>
          </Link>
          <div>|</div>
          <Link to="/register" className="navLink">
            <div className="">register</div>
          </Link>
        </div>
        <div className="displayFlex alighnItemsCenter justifyContentCenter">
          <Link to="/lurker">
            <div className="">open lurker</div>
          </Link>
          <div onClick={handleMore}>
            <img id="more" src={more} alt="more" />
          </div>
        </div>
      </div>
      {isSideNavOpen && (
        <div className="sideNav">
          <div id="innerSideNavContainer">
            <div className="displayFlex buttonContainer alighnItemsSelfStart flexDirectionColumn ">
              <Link to="/login" className="sideNavLink">
                <div className="">Login</div>
              </Link>
              <div>━︎</div>
              <Link to="/register" className="sideNavLink">
                <div className="">register</div>
              </Link>
            </div>
            <div id="closeBtnContainer">
              <button class="" onClick={handleMore}>
                <svg class="" width="12" height="12" viewBox="0 0 12 12">
                  <g fill="none" fill-rule="evenodd" aria-hidden="true">
                    <path d="M0 0h12v12H0"></path>
                    <path
                      fill="white"
                      d="M9.5 3.205L8.795 2.5 6 5.295 3.205 2.5l-.705.705L5.295 6 2.5 8.795l.705.705L6 6.705 8.795 9.5l.705-.705L6.705 6"
                    ></path>
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import "./Navbar.css";
// import spider from "../../images/spider.png";
// import "../../styles/CommonStyles.css";
// import more from "../lurker-icons/more.png";

// const Navbar = () => {
//   const handleMore = () => {
//     alert("more");
//   };

//   return (
//     <div id="navContainer">
//       <div className="displayFlex innerNavContainer justifyContentSpaceBetween">
//         <div className="displayFlex alighnItemsCenter">
//           <img src={spider} alt="" id="navIcon" />
//           <div id="lurker">Lurker</div>
//         </div>
//         <div
//           className="displayFlex buttonContainer alighnItemsCenter justifyContentCenter"
//           id="navButtonsContainer"
//         >
//           <Link to="/login" className="navLink">
//             <div className="">Login</div>
//           </Link>
//           <div>|</div>
//           <Link to="/register" className="navLink">
//             <div className="">register</div>
//           </Link>
//         </div>
//         <div className="displayFlex alighnItemsCenter justifyContentCenter">
//           <Link to="/lurker">
//             <div className="">open lurker</div>
//           </Link>
//           <div onClick={handleMore}>
//             <img id="more" src={more} alt="more" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;
