import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, render, Route, NavLink, Link } from "react-router-dom";
import Admin from './components/admin';
import About from './components/about';
import logo from './logo.svg';
import Button from 'react-bootstrap/Button';
import OrderList from './components/orderList';
import './styles/App.css';
import axios from 'axios';
import OrderDetail from './components/orderDetail';
import Modal from 'react-responsive-modal';
import './styles/nav.css';

function App() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [marketPrice, setMarketPrice] = useState(0);

  const closeOrderModal = () =>{
    setShowOrderModal(false)
  }

  const clickOrder= (order) => {
    setShowOrderModal(true);
    setSelectedOrder(order);
  }

  const placeOrder = (differential) => {
    let instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      timeout: 10000,
      headers: {}
    });
    instance.post('/placeOrder', {params: differential}).then((resp) => {
        instance.get('/getAllOrders').then((resp) => {
          //console.log(resp.data.data);
          setOrders(resp.data.data);
      })
    })
  }

  const syncOrders = () => {
    let instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      timeout: 100000,
      headers: {}
    });
    instance.post('/syncOrders', {params: null}).then((resp) => {
        console.log("Sync returned")
        instance.get('/getAllOrders').then((resp) => {
          setOrders(resp.data.data);
      })
    })
  }

  const getMarketPrice = () => {
    let instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      timeout: 100000,
      headers: {}
    });
    instance.get('/getMarketPrice').then((resp) => {
      console.log("Market Price: ",resp.data.data);
      setMarketPrice(resp.data.data);
    })
  }

  useEffect(() =>{
    let instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      timeout: 30000,
      headers: {}
    });
    instance.get('/getAllOrders').then((resp) => {
        setOrders(resp.data.data);
    })
    instance.get('/getMarketPrice').then((resp) => {
      setMarketPrice(resp.data.data);
    })
  },[])

  useEffect(() =>{
  },[orders])

  const HomeDisplay = () => {
    return (
      <div>
          <Button onClick={()=>placeOrder()}>Place New Order</Button><span> </span> 
          <Button onClick={syncOrders}>Sync</Button><span> </span>
          <Button onClick={()=>getMarketPrice()}>Get Market Price</Button> 
          <br /><br />
          {marketPrice === 0 ? "" : "Current BTC Market Price: $"+marketPrice}
          <br /><br />
          <OrderList orders={orders} click={clickOrder} />
      </div>
    )
  }

  return (
    <Router>
    <div className="App">
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
          }} to="/admin">Admin</NavLink></li>
          <li><NavLink activeStyle={{
                        fontWeight: "bold",
                        borderBottomColor: "rgb(74, 88, 146)",
                        borderBottomWidth: 2,
                        color: "rgb(238, 238, 238)"
                      }} to="/about">About</NavLink></li>
        
        </ul>
      </nav>
        <Modal
          open={showOrderModal}
          onClose={closeOrderModal}
          classNames={{
            overlay: "customOverlay",
            modal: "customModal"
          }}
        >
          <br /><br />
          <strong>Order:</strong> <span>{selectedOrder.id}</span><br />
          <strong>Status:</strong> <span>{selectedOrder.status}</span><br />
          <strong>Time:</strong> <span>{selectedOrder.time}</span><br />
          <strong>Price:</strong> <span>{selectedOrder.price}</span><br />
          <strong>Size:</strong> {Number(selectedOrder.size)}<br />
          <strong>Percent Filled:</strong><span> {Number(selectedOrder.filled_size) === 0 ? 0 : Number(selectedOrder.size) / Number(selectedOrder.filled_size) * 100} %  </span>
            
          <br /><br />
          <OrderDetail order={selectedOrder}></OrderDetail>
          
        </Modal>
        <Route path="/" exact render={()=>HomeDisplay()} />
        <Route path="/about" exact component={About} />
        <Route path="/admin" exact component={Admin} />
        <br /><br /><br />
        
        
      </header>
    </div>
    </Router>
  );
}

export default App;
