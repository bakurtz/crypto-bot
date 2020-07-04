import React, { useState, useEffect } from 'react';
import { withRouter  } from "react-router-dom";


const AccountBalances = (props) =>{
  const [baseBalance, setBaseBalance] = useState("");
  const [quoteBalance, setQuoteBalance] = useState("");
  const [baseCurrency, setBaseCurrency] = useState("");
  const [quoteCurrency, setQuoteCurrency] = useState("");

  useEffect(() =>{
    if(props.activeProduct && props.acctBalances.length>0) setNewBalances();
  },[props.activeProduct,props.acctBalances])

  useEffect(() =>{
    if(props.acctBalances.length>0 && baseCurrency && quoteCurrency){
      props.acctBalances.forEach(b=>{
        if(b.id===baseCurrency){
          setBaseBalance(b.available);
        }
        if(b.id===quoteCurrency){
          setQuoteBalance(b.available);
        }
      })
    }
  },[baseCurrency,quoteCurrency])

  const setNewBalances = () => {
    if(props.activeProduct.product && props.activeProduct.product.base_currency){
      setBaseCurrency(props.activeProduct.product.base_currency)
      setQuoteCurrency(props.activeProduct.product.quote_currency)
    }
    else{
      //set default to ETH
    }
  }

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
          <div >{quoteCurrency}:&emsp; {quoteBalance ? Number(quoteBalance).toFixed(4) : " ..." }</div>
          <div >{baseCurrency}:&emsp; {baseBalance ? Number(baseBalance).toFixed(4) : " ..." }</div>
          <hr style={{color:"white", padding: "0px", borderTop: "1px solid rgb(150, 150, 150)", margin: "0px"}} />
          <div className="centerFlex" style={{fontSize:"12px"}}> {baseCurrency+" Market Price:"} {props.marketPrice ? props.marketPrice+" "+quoteCurrency : " ..."}</div>
        </div>
      </div>
    </div>
  );
  
  return accountBalances;
}

export default withRouter(AccountBalances);
