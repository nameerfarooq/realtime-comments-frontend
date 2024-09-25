import React, { useState } from "react";
import Comments from "./components/Comments";

function App() {
  const tokenId = "66f44aedae36e865c13d1e01"; // Example tokenId
  const [userName, setuserName] = useState("user1");
  return (
    <div className="App">
      <h3>Token id : {tokenId}</h3>

      <input
        type="text"
        placeholder="Enter your name"
        onChange={(e) => setuserName(e.target.value)}
      />
      <br />
      <hr />
      <br />
      <Comments tokenId={tokenId} userName={userName} />
    </div>
  );
}

export default App;
