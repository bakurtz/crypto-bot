/*
    This API returns only OPEN orders. If order is cancelled or
    completely filled already, it will not appear on the list
*/

import { CoinbaseProExchangeAPI } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProExchangeAPI';
import { CoinbaseProConfig } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProInterfaces';
import * as CBPTT from 'coinbase-pro-trading-toolkit';

require('dotenv').config();

const logger = CBPTT.utils.ConsoleLoggerFactory();
const product = 'BTC-USD';


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


//OPEN ORDERS
coinbasePro.loadAllOrders(product).then((orders) => {
    console.log(orders)
    orders.forEach(o => {
        console.log("------LOAD ALL ORDERS")
        console.log("ID: "+o.extra.id);
        console.log("Price: "+o.extra.price);
        console.log("Status: "+o.extra.status);
        console.log("------")
    })
}).catch(err=>console.log(err));