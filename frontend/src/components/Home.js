import React from "react";

function Home(props) {
  return (
    <div>
      <div>Lurker</div>
      <div>{props.page}</div>
    </div>
  );
}

export default Home;
