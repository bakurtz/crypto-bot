import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import Orders from './components/orders';
import Admin from './components/admin';
import About from './components/about';
import Config from './components/config';
import axios from 'axios';
import './styles/App.css';
import './styles/nav.css';

function App() {
  const [orders, setOrders] = useState([]);
  const [marketPrice, setMarketPrice] = useState(0);
  const [acctBalance, setAcctBalance] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);

  let instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 10000,
    headers: {}
  });

  const syncOrders = () => {
    setIsSyncing(true);
    instance.post('/syncOrders', {params: null}).then((resp) => {
      getOrders();
    })
    .catch(err=>{
      console.log(err);
      setIsSyncing(false);
    })
  }

  const getMarketPrice = () => {
    instance.get('/getMarketPrice').then((resp) => {
      setMarketPrice(resp.data.data);
    })
  }

  const getOrders = () => {
    instance.get('/getAllOrders').then((resp) => {
      setOrders(resp.data.data);
      setIsSyncing(false);
    })
  }

  const getAccountBalances = () => {
    instance.get('/getAccountBalances').then((resp) => {
      console.log("Account Balances: ",resp.data.data);
      console.log("BTC: "+resp.data.data.btc)
      console.log("USD: "+resp.data.data.usd)
      setAcctBalance(resp.data.data);
    })
  }

  useEffect(() =>{
    getOrders();
    getMarketPrice();
    getAccountBalances();
  },[])

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

  const HomeDisplay = () => {
    return (
      <>
        <Config />
      </>
    )
  }

  const OrdersDisplay = () => {
    return (
      <Orders
        orders={orders}
        syncOrders={syncOrders}
        isSyncing={isSyncing}
      />
    )
  }

  return (
    <Router>
    <div className="App center">
      <header className="App-header">
        <nav className="Nav">
          <ul>
            <li><NavLink activeStyle={{
                          fontWeight: "bold",
                          borderBottomColor: "rgb(74, 88, 146)",
                          borderBottomWidth: 2,
                          color: "rgb(238, 238, 238)"
                        }} to="/">Home</NavLink></li>
            <li><NavLink activeStyle={{
                          fontWeight: "bold",
                          borderBottomColor: "rgb(74, 88, 146)",
                          borderBottomWidth: 2,
                          color: "rgb(238, 238, 238)"
                        }} to="/orders">Orders</NavLink></li>
            <li><NavLink activeStyle={{
                          fontWeight: "bold",
                          borderBottomColor: "rgb(74, 88, 146)",
                          borderBottomWidth: 2,
                          color: "rgb(238, 238, 238)"
                        }} to="/admin">Admin</NavLink></li>
            <li><NavLink activeStyle={{
                          fontWeight: "bold",
                          borderBottomColor: "rgb(74, 88, 146)",
                          borderBottomWidth: 2,
                          color: "rgb(238, 238, 238)"
                        }} to="/about">About</NavLink></li>
          
          </ul>
        </nav>
      </header>
          <div style={acctStyle} className="centerFlex max">
            <div style={acctBox} className="acctBox">
              <div><strong>Account Balances:</strong></div>
              <div style={{textAlign:"left"}}>
                <div >USD: &emsp;${acctBalance.usd ? Number(acctBalance.usd).toFixed(2) : " ..." } </div>
                <div >BTC: &emsp; {acctBalance.btc ? acctBalance.btc : " ..." }</div>
                <hr style={{color:"white", padding: "0px", borderTop: "1px solid rgb(150, 150, 150)", margin: "0px"}} />
                <div className="centerFlex" style={{fontSize:"12px"}}>BTC Market Price: ${marketPrice ? marketPrice : " ..."}</div>
              </div>
            </div>
          </div>
          <Route path="/" exact render={()=>HomeDisplay()} />
          <Route path="/orders" exact render={()=>OrdersDisplay()} />
          <Route path="/about" exact component={About} />
          <Route path="/admin" exact component={Admin} />
          <br /><br /><br />
      
      
    </div>
    </Router>
  );
}

export default App;