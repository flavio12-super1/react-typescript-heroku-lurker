import React from "react";
import "./styles/Register.css";

function Disclosure() {
  return (
    <div>
      <div className="textOne">Disclosure</div>
      <div id="reqOuterDiv">
        <div className="textTwo">Privacy Policy:</div>
        <div id="reqInnerDiv">
          <div className="containerTextDiv">
            <div className="indivText">- we do not sell any data</div>
          </div>
          <div className="containerTextDiv">
            <div className="indivText">
              - app is currently under development and chat features are not yet
              secure
            </div>
          </div>
          <div className="containerTextDiv">
            <div className="indivText">
              - we only store chat messages, login informaiton, and profile
              theme information in a database
            </div>
          </div>
        </div>
      </div>

      <div id="reqOuterDiv">
        <div className="textTwo">Terms of Service:</div>
        <div id="reqInnerDiv">
          <div className="containerTextDiv">
            <div className="indivText">
              - by creating an account you agree to potential data breaches to
              lurker which may be leaked
            </div>
          </div>
          <div className="containerTextDiv">
            <div className="indivText">
              - app might crash and lose all your data at any time without
              warning or notice on lurker media
            </div>
          </div>
          <div className="containerTextDiv">
            <div className="indivText">
              - we are not responsible for any data loss or data breaches of any
              accounts you make on lurker media
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Disclosure;
