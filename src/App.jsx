import React, { useEffect, useState } from "react";
import Comments from "./components/Comments";
import axios from "axios";

function App() {
  const tokenId = "66f4833199c23b4687719df0"; // Example tokenId
  const [username, setusername] = useState("");

  // code for creating new Tokens in db

  // const createToken = () => {
  //   const tokenData = { title: "ETH", content: "ETHEREUM" };

  //   // Post new token to API
  //   axios
  //     .post(`${import.meta.env.VITE_BASEURL}/tokens`, tokenData)
  //     .then((res) => {
  //       console.log("TOKEN CREATION :", res.data._id);
  //     });
  // };
  // useEffect(() => {
  //   createToken();
  // }, []);
  return (
    <div className="App">
      <h3>Token id : {tokenId}</h3>
      <div>
        <label htmlFor="">Enter your name </label>
        <input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setusername(e.target.value)}
        />
      </div>
      <br />
      <br />
      <hr />
      {username && <Comments tokenId={tokenId} username={username} />}
    </div>
  );
}

export default App;
