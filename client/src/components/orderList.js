
import React, { useState, useEffect } from 'react';
import OrderTile from './orderTile';
import '../styles/App.css';

const orderList = (props) => {
    let rows = props.orders.map((order,idx) => {
      return (
        <OrderTile order={order} key={idx} click={()=>props.click(order)} />

      )
    })
    return(
      <div className="center">
        <div className="master center">
        <div className={"hrow"}>
            <div className="hcol0"><b>Order ID</b></div>
            <div className="hcol2"><b>Size</b></div>
            <div className="hcol3"><b>Placed Date</b></div>
            <div className="hcol3">Status</div>
        </div>

        </div>
        {rows}
      </div>
    )
}

export default orderList;