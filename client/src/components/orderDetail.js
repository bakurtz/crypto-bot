
import React, { useState, useEffect } from 'react';
import OrderTile from './orderDetail';
import '../styles/orderDetail.css';

const orderList = (props) => {
    let fills = (<></>);
    let thead = (<></>);
    console.log(props.order)
    if(props.order.fills.length>0){
        thead = (<>
                <th>Trade ID:</th>
                <th>Size:</th>
                <th>Price:</th>
                <th>Fee:</th>
                </>);
        console.log("building rows...")
        fills = props.order.fills.map((fill,idx) => {
            return (
              <tr key={idx}>
                  <td>{fill.trade_id}</td>
                  <td>{fill.size}</td>
                  <td>{fill.price}</td>
                  <td>{fill.fee}</td>
              </tr>
      
            )
          })
    }
    
    return(
      <div className="center scrolling-wrapper">
          <table>
              <thead>
                  {thead}
              </thead>
              <tbody>
                {fills}
              </tbody>
          </table>
      </div>
    )
}

export default orderList;