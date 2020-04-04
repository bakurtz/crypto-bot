import React, { useState, useEffect } from 'react';
import { withRouter  } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import '../styles/admin.css';
import LogOutput from './logOutput';


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
        let instance = axios.create({
            baseURL: process.env.REACT_APP_API_URL,
            timeout: 10000,
            headers: {}
        });
        instance.get('/getCBOrder', {params: {orderId}}).then((resp) => {   
            if(resp.data.success === false && resp.data.error.response) setText(resp.data.error.response.body);
            else{setText("ORDERS: \n" + JSON.stringify(resp.data.data, null, 4))}
        })
    }

    const getLogs = () => {
        let instance = axios.create({
            baseURL: process.env.REACT_APP_API_URL,
            timeout: 10000,
            headers: {}
        });
        instance.get('/getLogs').then((resp) => {   
            if(resp.data.success === false && resp.data.error.response) setText(resp.data.error.response.body);
            let logResults = resp.data.data;
            setLogs(logResults);
            //else{setLogs(JSON.stringify(resp.data.data, null, 4))}
        })
    }

    const lookupFills = (orderId) => {
        let instance = axios.create({
            baseURL: process.env.REACT_APP_API_URL,
            timeout: 10000,
            headers: {}
        });
        instance.get('/getCbFills', {params: {orderId}}).then((resp) => {
            let fills = resp.data.data;
            setText("FILLS:  \n"+ fills.length + " fill(s) found \n "+JSON.stringify(fills, null, 4))
        })
    }

    let admin = (
        <div>
            <div className="filters">
                <br /><br />
                Lookup Order: <input onChange={ (ev)=> setOrderId(ev.target.value) } />
                    <Button onClick={()=>{lookupOrder(orderId)}}>Lookup</Button><br />
                Lookup Fills: <input />
                    <Button onClick={()=>{lookupFills(orderId)}}>Lookup</Button>
                <br /><br />
                <br /><br />
                <LogOutput className="centerFlex" logs={logs} />
                <div style={divStyle}>
                    <pre style={divStyle}><span style={divStyle}>{text}</span></pre>
                </div>
                
            </div>
        </div>
    )
    return admin;
}

export default withRouter(Admin);
