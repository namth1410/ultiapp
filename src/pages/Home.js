import a from "assets/img/a.jpg";
import React from "react";

const Home = () => {
  return (
    <div>
      <img src={a} alt="a" style={{ objectFit: "cover", width: "100%" }}></img>
    </div>
  );
};

export default Home;
