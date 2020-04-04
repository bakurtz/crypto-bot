
import React from 'react';
import OrderTile from './orderTile';
import '../styles/App.css';

const orderList = (props) => {
    let rows = props.orders.map((order,idx) => {
      return (
        <OrderTile order={order} key={idx} click={()=>props.click(order)} />

      )
    })
    return(
      <div className="centerFlex">
        <div className="master centerFlex">
        <div className={"hrow"}>
            <div className="hcol2"><b>Size</b></div>
            <div className="hcol3"><b>Date</b></div>
            <div className="hcol3">Status</div>
        </div>

        </div>
        {rows}
      </div>
    )
}

export default orderList;