import React, { useState } from "react";
import axiosInstance from "../../config/axiosConfig";
import { useNavigate } from "react-router-dom";

function Explore() {
  let navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const mySearch = () => {
    axiosInstance
      .post("/mySearch", {
        search: search,
      })
      .then((response) => {
        if (response.data.message == "success") {
          console.log(response.data.users);
          setSearchResult([]);
          setSearchResult((result) => [response.data.users, ...result]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNavigate = (username) => {
    navigate("/lurker/" + username);
  };

  const renderResults = () => {
    return searchResult.map((users, index) => (
      <div key={index}>
        <div>Results for "{search}"</div>
        {users.map((user) => (
          <div key={user._id} className="">
            <div className="btn">
              <button onClick={() => handleNavigate(user.email)}>
                {user.email}
              </button>
            </div>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div>
      <div>Explore</div>
      <div>
        <input
          type="text"
          placeholder="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => mySearch()}>search</button>
      </div>
      <div>
        <div>results</div>
        <div>{renderResults()}</div>
      </div>
    </div>
  );
}

export default Explore;
