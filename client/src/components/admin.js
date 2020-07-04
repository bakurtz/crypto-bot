import React, { useState, useEffect } from 'react';
import { withRouter  } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import '../styles/admin.css';
import LogOutput from './logOutput';
import { api } from "../apis/apiCalls";
import Axios from 'axios';

const Admin = (props) =>{

    const [orderId, setOrderId] = useState("3b8c4e03-b346-400d-9dba-fe28f282b2f4");
    const [text, setText] = useState("");
    const [logs, setLogs] = useState([]);
    const [products, setProducts] = useState([]);
    const divStyle = {
        fontSize: "14px",
        color: "white",
        textAlign: "left"
    }

    useEffect(() =>{
        getLogs();
        getProducts();
    },[])

    useEffect(()=>{

    },[products])
    
    
    let productCheckBoxes = (<div style={{color:"white"}}>YOOOO!!</div>)
    let checkboxes;

    const productBoxChecked =(i) => {
        console.log(products[i].id,!products[i].isActive);
        console.log()
        let newProds = [...products];
        newProds[i].isActive = !products[i].isActive;
        setProducts(newProds);
        api().post('/profile/setActive',{params: {
            id: products[i].id,
            isActive: newProds[i].isActive
        }}).then(resp=>{
            
        })
    }
    
    let getProductCheckBoxes = () => {
        if(!!products && products.length>0){
            checkboxes = products.map((product,idx) => {
                return (
                    <li key={product.id}><input type="checkbox" 
                        name={product.id} 
                        value={product.id}
                        checked={product.isActive}
                        onChange={()=>productBoxChecked(idx)}
                        /><label>{product.id}</label></li>
                )
            })
        }
        return (
            <div className="checkBoxGrid centerFlex" style={{color:"white"}}>
                Product Selections:
                <ul className="checkbox-grid">
                    {checkboxes}
                </ul>
            </div>
        )
    }

    const getLogs = () => {
        api().get('/profile/getLogs').then((resp) => {   
            if(resp.data.success === false && resp.data.error.response) setText(resp.data.error.response.body);
            let logResults = resp.data.data;
            setLogs(logResults);
            //else{setLogs(JSON.stringify(resp.data.data, null, 4))}
        }).catch(err=>console.log("Cannot get logs.",err))
    }

    const getProducts = () => {
        api().post('/products/refreshProducts').then(resp => {   
            let apiProducts = resp.data.data;
            setProducts(apiProducts);
        }).catch(err=>console.log("Cannot get products.",err))
    }

    const lookupOrder = (orderId) => {
        api().get(`/coinbase/getOrder/${orderId}`).then((resp) => {   
            if(resp.data.success === false && resp.data.error.response) setText(resp.data.error.response.body);
            else{setText("ORDERS: \n" + JSON.stringify(resp.data.data, null, 4))}
        }).catch(err=>console.log("Failed attempt to lookup order.",err))
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
                Logs:
                <br />
                <br />
                <LogOutput className="centerFlex" logs={logs} />
                
                
            </div>
        </div>
    )
    return (
        <>
            {getProductCheckBoxes()}
            {admin}
        </>
    );
}

export default withRouter(Admin);
