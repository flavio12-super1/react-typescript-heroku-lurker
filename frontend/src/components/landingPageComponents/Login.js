import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //check for url
  var currentUrl = window.location.href;
  var partStr = currentUrl.slice(0, 5);
  var uri = "";
  if (partStr === "https") {
    uri = "https://react-nodejs-heroku-public.herokuapp.com";
  } else {
    uri = "http://localhost:8000";
  }
  console.log(uri);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${uri}/login`, {
        email,
        password,
      });
      const { token, user } = await response.data;
      console.log(user);
      localStorage.setItem("token", token);
      localStorage.setItem("email", user.email);
      localStorage.setItem("userID", user._id);
      window.location.href = `${uri}/lurker`;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          // handle Unauthorized error
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
      <div className="textOne">Login</div>
      <div className="textTwo">
        Make sure you have created an account first : )
      </div>
      <form onSubmit={handleSubmit}>
        <div className="displayFlex alighnItemsCenter">
          <div className="formLabel">
            <label>Email:</label>
          </div>
          <input
            type="email"
            value={email}
            placeholder="enter your email"
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="displayFlex alighnItemsCenter">
          <div className="formLabel">
            <label>Password:</label>
          </div>
          <input
            type="password"
            value={password}
            placeholder="dont forget your password 👀"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
