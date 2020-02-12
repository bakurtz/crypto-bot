
import React, { useState, useEffect } from 'react';
import OrderTile from './orderTile';
import '../styles/App.css';
import '../styles/tile.css';
import Auxx from '../hoc/auxx';

const orderTile = (props) => {
    let tile = (<div className="content-row"></div>);
    let color = "dark";
    if(props.order.status==="open") color="green"
    let d = new Date(props.order.createdAt);
    let newDate= (d.getMonth() + 1) + '/' + d.getDate() + '/' +  d.getFullYear();
    tile = (   
        <div onClick={props.click} className="master center">   
            <div className={color+" fontColor row "} onClick={props.click}>
                <div className="col1">
                    {props.order.id}
                </div>

                <div className="col2">
                    {props.order.size}
                </div>

                <div className="col3">
                    {newDate}
                </div>

                <div className={"col4 center"}>
                    {props.order.status}
                </div>
            </div>
        </div>
    )
    return(
        <Auxx className="container" onClick={()=>console.log("xx")}> {tile} </Auxx>
    )
}

export default orderTile;