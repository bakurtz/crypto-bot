import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import Orders from './components/orders';
import Admin from './components/admin';
import About from './components/about';
import Register from './components/register';
import Login from './components/login';
import Config from './components/config';
import PrivateRoute from './components/PrivateRoute';
import AccountBalances from './components/accountBalances';
import { api } from "./apis/apiCalls";

import axios from 'axios';
import './styles/App.css';
import './styles/nav.css';

function App() {
  const [orders, setOrders] = useState([]);
  const [marketPrice, setMarketPrice] = useState(0);
  const [acctBalance, setAcctBalance] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const syncOrders = () => {
    setIsSyncing(true);
    api().post('/coinbase/syncOrders', {params: null}).then((resp) => {
      getOrders();
    })
    .catch(err=>{
      console.log(err);
      setIsSyncing(false);
    })
  }

  const getMarketPrice = () => {
    api().get('/coinbase/getMarketPrice').then((resp) => {
      setMarketPrice(resp.data.data);
    })
  }

  const getOrders = () => {
    api().get('/order/getAll').then((resp) => {
      setOrders(resp.data.data);
      setIsSyncing(false);
    })
  }

  const getAccountBalances = () => {
    if(isLoggedIn){
      api().get('/coinbase/getAccountBalances').then((resp) => {
        console.log("Account Balances: ",resp.data.data);
        console.log("BTC: "+resp.data.data.btc)
        console.log("USD: "+resp.data.data.usd)
        setAcctBalance(resp.data.data);
      })
    }
  }

  useEffect(() =>{
    getOrders();
    getMarketPrice();
    getAccountBalances();
  },[])

 

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

  let accountBalances = (
    <AccountBalances acctBalance marketPrice />
  )

  let nav = (
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
  )

  let handleLogin = (valid) => {
    if(valid) setIsLoggedIn(true)
    else{
      setIsLoggedIn(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("jwt-access-token");
    localStorage.removeItem("jwt-refresh-token");
    setIsLoggedIn(false);
  }

  return (
    <Router>
    <div className="App center">
      <header className="App-header">
        { isLoggedIn ? nav : "" }
        { isLoggedIn ? accountBalances : "ABCDEFG" }
      </header>
          
          <PrivateRoute isAuthenticated={isLoggedIn} path="/" exact render={()=>HomeDisplay()} />
          <Route path="/register" exact render={Register} />
          <Route path="/login" exact render={ (props) => <Login {...props}  handleLogin={handleLogin} /> } />
          <Route path="/orders" exact render={()=>OrdersDisplay()} />
          <Route path="/about" exact component={About} />
          <Route path="/admin" exact component={Admin} />
          <br /><br /><br />
      
      
    </div>
    </Router>
  );
}

export default App;