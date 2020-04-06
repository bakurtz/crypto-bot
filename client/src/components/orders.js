import React, { useState } from 'react';
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

    let spinner = (<div className="loader">Loading...</div>)

    let orders = ( <>
        <br />
        <Button className="btn-sm" onClick={props.syncOrders}>
        <FontAwesomeIcon className={"nowrap fas "} icon={faSync} style=""/> 
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
          <strong>Order ID:</strong> <span>{selectedOrder.id}</span><br />
          <strong>Status:</strong> <span>{selectedOrder.status}</span><br />
          <strong>Time:</strong> <span>{selectedOrder.time}</span><br />
          <strong>Percent Filled:</strong><span> {Number(selectedOrder.filled_size) === 0 ? 0 : Number(selectedOrder.size) / Number(selectedOrder.filled_size) * 100} %  </span><br />
          <hr />
          <strong>Total USD spent:</strong> ${Number(selectedOrder.totalUsdSpent)}<br />
          <strong>BTC size:</strong> {Number(selectedOrder.size)}<br />
          <strong>Market Price (1 BTC):</strong> <span>{selectedOrder.price}</span><br />
          
          
          <br /><br />
          <OrderDetail order={selectedOrder}></OrderDetail>
          
        </Modal>
        </>
    );
    
    return orders;
}

export default withRouter(Orders);
