import React from 'react';
import { withRouter  } from "react-router-dom";



const about = (props) =>{
  var divStyle = {
    padding: "30px",
    width:"80%"
  };
  let about = (
    <div className="centerFlex">
      <div className="fontColor about" style={divStyle}>
        Crypto-bot is an automated cryptocurrency trade scheduler powered by the Coinbase Pro API.
         
          <br /><br />
          <br /><br />
          <a href="https://github.com/TheRyanMiller/crypto-bot">View this project on GitHub</a>
      </div>
    </div>
  )

  return about;

}

export default withRouter(about);
