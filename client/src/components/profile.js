import React from 'react';
import { withRouter  } from "react-router-dom";



const profile = (props) =>{
  var divStyle = {
    padding: "30px",
    width:"80%"
  };
  let profile = (
    <div className="centerFlex">
      <div className="fontColor about" style={divStyle}>
          Profile data goes here
         
          <br /><br />
      </div>
    </div>
  )

  return profile;

}

export default withRouter(profile);
