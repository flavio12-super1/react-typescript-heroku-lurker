import React, { useState } from "react";
import axios from "axios";
import "./styles/Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post("/signup", { email, password });
      window.location.href = "/login";
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          // handle Unauthorized error
          alert(error.response.data.error);
        } else if (error.response.status === 409) {
          alert(error.response.data.error);
        } else if (error.response.status === 429) {
          // handle rate-limited error
          console.log("you got rate limited");
          alert(error.response.data.error.message);
        } else {
          console.error(error);
        }
      }
    }
  };

  return (
    <div>
      <div className="textOne">Register</div>
      <div id="reqOuterDiv">
        <div className="textTwo">Password must have at least:</div>
        <div id="reqInnerDiv">
          <div className="containerTextDiv">
            <div className="indivText">- one uppercase letter</div>
          </div>
          <div className="containerTextDiv">
            <div className="indivText">- one lowercase letter</div>
          </div>
          <div className="containerTextDiv">
            <div className="indivText">- one digit</div>
          </div>
          <div className="containerTextDiv">
            <div className="indivText">- and is at least 8 characters long</div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="displayFlex alighnItemsCenter">
          <div className="formLabel">
            <label>Email:</label>
          </div>
          <input
            type="email"
            value={email}
            placeholder="enter a valid email"
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="displayFlex alighnItemsCenter">
          <div className="formLabel">
            <label>Password:</label>
          </div>
          <input
            type="password"
            placeholder="enter a strong password : )"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
