/*
    SYNC
    1. Query DB Orders where "STATUS!=DONE"
    2. Query CB API Orders ("STATUS=OPEN")
    3. Compare lists to find diff
    and find list of DB orders that need to be updated
*/

import { CoinbaseProExchangeAPI } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProExchangeAPI';
import { CoinbaseProConfig } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProInterfaces';
import { AuthenticatedClient } from 'coinbase-pro';
import { LiveOrder } from 'coinbase-pro-trading-toolkit/build/src/lib/Orderbook';
import * as CBPTT from 'coinbase-pro-trading-toolkit';
import { FillFilter } from 'coinbase-pro';
import axios from 'axios';
import { Order, Fill } from '../interfaces/Order';
require('dotenv').config();

module.exports = () => {
    return new Promise((resolve,reject)=>{

    let allCBPromises: any[] = [];


    let openDbOrders: Order[];
    let openCBOrders: LiveOrder[];
    let callsComplete = 0;
    const product = 'BTC-USD';
    const logger = CBPTT.utils.ConsoleLoggerFactory();

    //Prepare coinbase configs
    const coinbaseProConfig: CoinbaseProConfig = {
        logger: logger,
        apiUrl: process.env.COINBASE_PRO_API_URL,
        auth: {
            key: process.env.COINBASE_PRO_KEY,
            secret: process.env.COINBASE_PRO_SECRET,
            passphrase: process.env.COINBASE_PRO_PASSPHRASE
        }
    };
    const coinbasePro = new CoinbaseProExchangeAPI(coinbaseProConfig);
    let authClient = new AuthenticatedClient(coinbaseProConfig.auth.key, coinbaseProConfig.auth.secret, coinbaseProConfig.auth.passphrase, coinbaseProConfig.apiUrl);
    //Prepare API config
    let instance = axios.create({
        baseURL: process.env.API_URL,
        timeout: 10000,
        headers: {}
    });

    getAllOpenCBOrders(); // CALL!
    getAllOpenDBOrders(); // CALL!


    //Sync DB data with Coinbase
    const syncUp = () => {
        let foundMatch = false;
        console.log(openCBOrders.length+" open CB orders found via API.");
        console.log(openDbOrders.length+" open orders found in database.");
        console.log()
        if(openDbOrders.length>0){
            console.log("Iterating over orders to find a match.");
            openDbOrders.forEach(dbOrder => {
                console.log("Iterating over DB ORDER: "+dbOrder.id)
                //CB Orders Were Found Found
                if(openCBOrders.length>0){
                    for(let i=0;i<openCBOrders.length;i++){
                        foundMatch=false;
                        if(dbOrder.id===openCBOrders[i].id){
                            console.log("Found a match. ")
                            console.log("Status CB: "+openCBOrders[i].status)
                            console.log("Found a match. "+dbOrder.status);
                            foundMatch=true;
                            if(dbOrder.filled_size!=openCBOrders[i].extra.filled_size){ // Get ready to update the new fills!
                                //Need to update fills for this order
                                console.log("Need to update fills for OrderID: "+dbOrder.id)
                                console.log("Fetching fills data for this order...");
                                allCBPromises.push(require('./promiseTypes/fillsPromise.ts')(dbOrder));
                            }
                            break;
                        }
                    }
                    if(!foundMatch){
                        //Never found a match for this DB Order, query CB for Order#
                        console.log("Found no match during true-up. Now querying the Coinbase API for DB Order ID: "+dbOrder.id);
                        allCBPromises.push(require('./promiseTypes/orderPromise.ts')(dbOrder))

                        
                    }
                }
                else{
                    //No CB Orders found
                    console.log("Didn't find any open orders on Coinbase. Syncing fills to the database.")
                    let fillFilter: FillFilter = {
                        product_id: product,
                        order_id: dbOrder.id
                    }
                    authClient.getFills(fillFilter).then((fills: any)=>{ // CALL!
                        console.log(fills)
                        if(!fills || fills.length===0){
                            console.log("No fill data found for Order "+dbOrder.id+". (Unexpected)");
                            return;
                        }
                        console.log("Fill data found.");
                        //add All fills
                        insertMissingFills(dbOrder.fills, fills, dbOrder.id);
                    }).catch(err => {
                        //Return error message 
                        let rateLimitError = false;
                        let errorMessage = JSON.parse(err.response.body).message;
                        if(errorMessage.includes("rate limit")) rateLimitError = true;
                        let e = {rateLimitError, errorMessage}
                        console.log(e);
                    });
                    //Update Order
                    coinbasePro.loadOrder(dbOrder.id).then((order: LiveOrder) => { // CALL!
                            instance.post('/updateOrder',{params: {order}}).then((resp) => {
                                console.log("updateDbOrder API CALL SUCCEEDED");
                                openDbOrders=resp.data.data;
                            }).catch(err => console.log("updateDbOrder API CALL FAILED"));
                    }).catch(err => {
                        //Return error message 
                        let rateLimitError = false;
                        let errorMessage = JSON.parse(err.response.body).message;
                        if(errorMessage.includes("rate limit")) rateLimitError = true;
                        let e = {rateLimitError, errorMessage}
                        console.log(e);
                    })
                    
                }
            })
        }
        else{
            console.log("No open DB orders found.")
        }
    }


    function getAllOpenDBOrders(){ // CALL!
        instance.get('/getOpenOrders?byLastSync=true')
        .then((resp) => {
            console.log("Successful DB CALL");
            openDbOrders=resp.data.data;
            callsComplete++;
            areCallsReturned();
        })
        .catch(err => console.log("DB CALL FAILED",err));
    }

    function getAllOpenCBOrders(){ // CALL!
        //OPEN ORDERS
        coinbasePro.loadAllOrders(product).then((orders) => {
            openCBOrders=orders;
            callsComplete++;
            areCallsReturned();
        }).catch(err => {
            //Return error message 
            let rateLimitError = false;
            let errorMessage = JSON.parse(err.response.body).message;
            if(errorMessage.includes("rate limit")) rateLimitError = true;
            let e = {rateLimitError, errorMessage}
            console.log(e);
        })
    }

    const areCallsReturned = () => {
        if (callsComplete == 2){
            syncUp();
        }
    }

    const insertMissingFills = (dbFills: Fill[], cbFills: Fill[], orderId: string) => {
        let match = false;
        let newFills: Fill[] = [];
        for(let i=0;i<cbFills.length;i++){
            for(let k=0;k<dbFills.length;k){
                if(cbFills[i].trade_id === dbFills[k].trade_id){
                    match = true;
                    break;
                }
                else{
                    match = false;
                }
            }
            if(!match) newFills.push(cbFills[i]);
        }
        if(newFills.length>0){
            //Mismatches found. Write fills to db order
            console.log(newFills.length+" mismatches found. Writing to db.");
            instance.post('/addFills',{params: {
                fills: newFills,
                orderId: orderId
            }})
            .then((resp) => { // CALL!
                console.log("/addFills db write succeeded");
                openDbOrders=resp.data.data;
            })
            .catch(err => console.log("/addFills db write failed."));
        }
        else{
            console.log("No mismatched fills found for order: "+orderId);
        }
        return newFills;
    }
    resolve();
})}