import React, { useState, useEffect } from 'react';
import { withRouter  } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import '../styles/admin.css';
import LogOutput from './logOutput';
import { api } from "../apis/apiCalls";

const Admin = (props) =>{

    const [orderId, setOrderId] = useState("3b8c4e03-b346-400d-9dba-fe28f282b2f4");
    const [text, setText] = useState("");
    const [logs, setLogs] = useState([]);
    const divStyle = {
        fontSize: "14px",
        color: "white",
        textAlign: "left"
    }

    useEffect(() =>{
        getLogs();
      },[])
    

    const lookupOrder = (orderId) => {
        api().get(`/coinbase/getOrder/${orderId}`).then((resp) => {   
            if(resp.data.success === false && resp.data.error.response) setText(resp.data.error.response.body);
            else{setText("ORDERS: \n" + JSON.stringify(resp.data.data, null, 4))}
        }).catch(err=>console.log("Failed attempt to lookup order.",err))
    }

    const getLogs = () => {
        api().get('/profile/getLogs').then((resp) => {   
            if(resp.data.success === false && resp.data.error.response) setText(resp.data.error.response.body);
            let logResults = resp.data.data;
            setLogs(logResults);
            //else{setLogs(JSON.stringify(resp.data.data, null, 4))}
        }).catch(err=>console.log("Cannot get logs.",err))
    }

    const lookupFills = (orderId) => {
        api().get(`/coinbase/getFills/${orderId}`).then((resp) => {
            let fills = resp.data.data;
            setText("FILLS:  \n"+ fills.length + " fill(s) found \n "+JSON.stringify(fills, null, 4))
        }).catch(err=>console.log("Failed attempt to lookup fill.",err))
    }

    let admin = (
        <div>
            <div className="adminSearch centerFlex"><br />
                <div className="adminSearch centerFlex" >
                <span >Lookup Order: </span>
                <div className="centerFlexRow">
                    <input className="admin" onChange={ (ev)=> setOrderId(ev.target.value) } />
                    <Button className="inlineButton" size="sm" onClick={()=>{lookupOrder(orderId)}}>Search</Button>
                </div>
                <br />
                
                Lookup Fills: <br />
                <div className="centerFlexRow">
                    <input className="admin" onChange={ (ev)=> setOrderId(ev.target.value) } />
                    <Button className="inlineButton" size="sm" onClick={()=>{lookupFills(orderId)}}>Search</Button>
                </div>
                </div>
                <br /><br />
                <div style={divStyle}>
                    <pre style={divStyle}><span style={divStyle}>{text}</span></pre>
                </div>
                <br /><br />
                <LogOutput className="centerFlex" logs={logs} />
                
                
            </div>
        </div>
    )
    return admin;
}

export default withRouter(Admin);
