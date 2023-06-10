import React, { useState } from "react";
import axios from "axios";

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
      <h1>Register</h1>
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
