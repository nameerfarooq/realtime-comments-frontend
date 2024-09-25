import React, { useEffect, useState } from "react";
import Comments from "./components/Comments";
import axios from "axios";

function App() {
  const tokenId = "66f456f83cc6c2be6e3fbd13"; // Example tokenId
  const [userName, setuserName] = useState("user1");

  //code for creating new Tokens in db
  // const createToken = () => {
  //   const tokenData = { title: "ETH", content: "ETHEREUM" };

  //   // Post new token to API
  //   axios.post("http://localhost:5000/tokens", tokenData).then((res) => {
  //     console.log("TOKEN CREATION :", res);
  //   });
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
          onChange={(e) => setuserName(e.target.value)}
        />
      </div>
      <br />
      <br />
      <hr />
      <Comments tokenId={tokenId} userName={userName} />
    </div>
  );
}

export default App;
