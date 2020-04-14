import React from 'react';
import { withRouter  } from "react-router-dom";


const AccountBalances = (props) =>{
    
    const acctStyle = {
        fontSize: "16px",
        color: "white",
        textAlign: "center"
      }
    
      const acctBox= {
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "black",
        padding: "7px",
        borderRadius: "5px" 
      }
    
    let accountBalances = ( 
        <div style={acctStyle} className="centerFlex max">
        <div style={acctBox} className="acctBox">
          <div><strong>Account Balances:</strong></div>
          <div style={{textAlign:"left"}}>
            <div >USD: &emsp;${props.acctBalance.usd ? Number(props.acctBalance.usd).toFixed(2) : " ..." } </div>
            <div >BTC: &emsp; {props.acctBalance.btc ? props.acctBalance.btc : " ..." }</div>
            <hr style={{color:"white", padding: "0px", borderTop: "1px solid rgb(150, 150, 150)", margin: "0px"}} />
            <div className="centerFlex" style={{fontSize:"12px"}}>BTC Market Price: ${props.marketPrice ? props.marketPrice : " ..."}</div>
          </div>
        </div>
      </div>
    );
    
    return accountBalances;
}

export default withRouter(AccountBalances);
