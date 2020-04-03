import axios from 'axios';
import { Order } from '../interfaces/Order';
require('dotenv').config();

module.exports = () => {
    return new Promise((resolve,reject)=>{

    let allCBPromises: any[] = [];
    let openDbOrders: Order[];
    //Prepare API config
    // let instance = axios.create({
    //     baseURL: process.env.API_URL,
    //     timeout: 10000,
    //     headers: {}
    // });
    axios.get('http://localhost:3001/api/getOpenOrders?byLastSync=true')
    .then((resp) => {
        console.log("Successful DB CALL (sync3) "+resp.data.data);
        openDbOrders=resp.data.data;
        console.log(openDbOrders.length+" open orders found in database.");
        console.log()
        if(openDbOrders.length>0){
            console.log("Iterating over orders to find a match.");
            openDbOrders.forEach(dbOrder => {
                console.log("Iterating over DB ORDER: "+dbOrder.id)
                allCBPromises.push(require('./promiseTypes/fillsPromise.ts')(dbOrder));
                allCBPromises.push(require('./promiseTypes/orderPromise.ts')(dbOrder));
            })
        }
        else{
            console.log("No open DB orders found.")
        }
        if(allCBPromises.length>0){
            Promise.all(allCBPromises).then((resp)=>{
                "test";
            }).catch(function(err) {
                // log that I have an error, return the entire array;
                console.log('A promise failed to resolve', err);
            })
        }
    })
    .catch(err => console.log("DB CALL FAILED",err));
})}