import React, { useEffect, useState } from "react";
import Comments from "./components/Comments";
import axios from "axios";

function App() {
  const tokenAddress = "0ww0B295669a9FD93d5F28D9Ec85E40f4cb697BAe"; // Example tokenId
  const [username, setusername] = useState("");

  // code for creating new Tokens in db

  // const createToken = () => {
  //   const tokenData = {
  //     tokenName: "ETH",
  //     tokenAddress: "0ww0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
  //     creatorAddress: "abc",
  //   };

  //   // Post new token to API
  //   axios
  //     .post(`${import.meta.env.VITE_BASEURL}/tokens`, tokenData)
  //     .then((res) => {
  //       console.log("TOKEN CREATION :", res.data.tokenAddress);
  //     });
  // };
  // useEffect(() => {
  //   createToken();
  // }, []);
  return (
    <div className="App">
      <h3>tokenAddress is : {tokenAddress}</h3>
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
      {username && <Comments tokenAddress={tokenAddress} username={username} />}
    </div>
  );
}

export default App;
