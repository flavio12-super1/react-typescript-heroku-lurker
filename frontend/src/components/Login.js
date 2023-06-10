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
      <h1>Login updated</h1>
      <div>
        password must have at least one uppercase letter, one lowercase letter,
        one digit, and is at least 8 characters long:
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
