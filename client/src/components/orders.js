import React, { useState, useEffect } from 'react';
import { withRouter  } from "react-router-dom";
import OrderList from './orderList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Modal from 'react-responsive-modal';
import OrderDetail from './orderDetail';
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

    useEffect(() =>{
      if(localStorage.getItem("jwt-access-token")){
        props.getOrders();
      }
    },[])

    let spinner = (<div className="loader">Loading...</div>)

    let orders = ( <>
        <br />
        <Button className="btn-sm" onClick={props.syncOrders}>
        <FontAwesomeIcon className={"nowrap fas "} icon={faSync} /> 
          &emsp;Refresh</Button>
        <br />
        { props.isSyncing ? spinner : <OrderList orders={props.orders} click={clickOrder} />}
        
        
        <Modal
          open={showOrderModal}
          onClose={closeOrderModal}
          classNames={{
            overlay: "customOverlay",
            modal: "customModal"
          }}
        >
          <br /><br />
          {console.log(selectedOrder)}
          <strong>USD spent:</strong>&nbsp; ${Number(selectedOrder.totalUsdSpent)}<br />
          <strong>BTC size:</strong>&nbsp; {Number(selectedOrder.size)}<br />
          <strong>BTC Order Price:</strong>&nbsp; <span>${selectedOrder.price}/BTC</span><br />
          <strong>BTC Market Price:</strong>&nbsp; <span>${selectedOrder.marketPrice}/BTC</span><br />
          <hr />
          <strong>Order ID:</strong> <span>{selectedOrder.id}</span><br />
          <strong>Status:</strong> <span>{selectedOrder.status}</span><br />
          <strong>Time:</strong> <span>{selectedOrder.time}</span><br />
          <strong>Percent Filled:</strong><span> {Number(selectedOrder.filled_size) === 0 ? 0 : Number(selectedOrder.size) / Number(selectedOrder.filled_size) * 100} %  </span><br />
          
          
          
          
          <br /><br />
          <OrderDetail order={selectedOrder}></OrderDetail>
          
        </Modal>
        </>
    );
    
    return orders;
}

export default withRouter(Orders);
