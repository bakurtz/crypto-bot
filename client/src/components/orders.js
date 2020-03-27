import React, { useState } from 'react';
import { withRouter  } from "react-router-dom";
import OrderList from './orderList';
import Button from 'react-bootstrap/Button';
import Modal from 'react-responsive-modal';
import OrderDetail from './orderDetail';
import axios from 'axios';
import '../styles/admin.css';


const Orders = (props) =>{
    const [selectedOrder, setSelectedOrder] = useState({});
    const [showOrderModal, setShowOrderModal] = useState(false);
    const closeOrderModal = () =>{
        setShowOrderModal(false)
    }
    
    const clickOrder= (order) => {
        setShowOrderModal(true);
        setSelectedOrder(order);
    }

    let orders = ( <>
        <br />
        {props.marketPrice === 0 ? "" : "Current BTC Market Price: $"+props.marketPrice}
        <br />
        <br />
        <OrderList orders={props.orders} click={clickOrder} />
        
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
        </>
    );
    
    return orders;
}

export default withRouter(Orders);
