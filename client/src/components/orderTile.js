
import React from 'react';
import '../styles/App.css';
import '../styles/tile.css';
import Auxx from '../hoc/auxx';

const orderTile = (props) => {
    let tile = (<div className="content-row"></div>);
    let color = "dark";
    let productId = "";
    if(props.order.status==="open") color="green"
    let d = new Date(props.order.createdAt);
    if(props.order.productId) productId = props.order.productId.substring(0,props.order.productId.indexOf("-"))
    let newDate= (d.getMonth() + 1) + '/' + d.getDate() + '/' +  d.getFullYear();
    tile = (   
        <div onClick={props.click} className="master centerFlex">   
            <div className={color+" fontColor row "} onClick={props.click}>
                <div className="col1">
                    {productId}
                </div>
                <div className="col2">
                    {props.order.size}
                </div>

                <div className="col3">
                    {newDate}
                </div>

                <div className={"col3"}>
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