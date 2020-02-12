/***************************************************************************************************************************
 * @license                                                                                                                *
 * Copyright 2017 Coinbase, Inc.                                                                                           *
 *                                                                                                                         *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance          *
 * with the License. You may obtain a copy of the License at                                                               *
 *                                                                                                                         *
 * http://www.apache.org/licenses/LICENSE-2.0                                                                              *
 *                                                                                                                         *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on     *
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the                      *
 * License for the specific language governing permissions and limitations under the License.                              *
 ***************************************************************************************************************************/

// import { AvailableBalance,
//     Balances } from 'coinbase-pro-trading-toolkit/build/src/exchanges/AuthenticatedExchangeAPI';
import { BigJS } from 'coinbase-pro-trading-toolkit/build/src/lib/types';
//import { Ticker } from 'coinbase-pro-trading-toolkit/build/src/exchanges/PublicExchangeAPI';
import { LiveOrder } from 'coinbase-pro-trading-toolkit/build/src/lib/Orderbook';
import { CoinbaseProExchangeAPI } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProExchangeAPI';
import { CoinbaseProConfig } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProInterfaces';
import { PlaceOrderMessage } from 'coinbase-pro-trading-toolkit/build/src/core/Messages';
import * as CBPTT from 'coinbase-pro-trading-toolkit';
require('dotenv').config();

const logger = CBPTT.utils.ConsoleLoggerFactory();
let marketPrice: number;
let buyDifferential: number = Number(process.env.BUY_DIFFERENTIAL);
let fiatToSpend: number = Number(process.env.FIAT_TO_SPEND);
console.log("BUY DIFF: "+buyDifferential);

const coinbaseProConfig: CoinbaseProConfig = {
    logger: logger,
    apiUrl: process.env.COINBASE_PRO_API_URL || 'https://api.pro.coinbase.com',
    auth: {
        key: process.env.COINBASE_PRO_KEY,
        secret: process.env.COINBASE_PRO_SECRET,
        passphrase: process.env.COINBASE_PRO_PASSPHRASE
    }
};

const coinbasePro = new CoinbaseProExchangeAPI(coinbaseProConfig);
const product = 'BTC-USD';

coinbasePro.loadMidMarketPrice(product).then((price: BigJS) => {
    marketPrice = Number(price);
    console.log("====== Market Price: "+marketPrice);
    let orderPrice: number = calcOrderPrice();
    let orderSize: number = (fiatToSpend/orderPrice);
    let order: PlaceOrderMessage = buildOrder(orderPrice, orderSize);
    
    coinbasePro.placeOrder(order).then((o: LiveOrder) => {
            console.log(o);
            console.log(`Order ${o.id} successfully placed`);
            return coinbasePro.loadAllOrders()
        }).then((orders) => {
            console.log(orders)
            //console.log(`Order status: ${o.status}, ${o.time}`);
        })
    
}).catch(logError);

const calcOrderPrice = () => {
    return marketPrice - (marketPrice * buyDifferential);
}

// coinbasePro.loadTicker(product).then((ticker: Ticker) => {
//     console.log(`24hr Vol - ${ticker.volume.toFixed(2)}\t\t\t Price - ${ticker.price.toFixed(2)}`);
//     console.log(`Ask - ${ticker.ask.toFixed(2)}\t\t\t Bid - ${ticker.bid.toFixed(2)}`);
// }).catch(logError);

// coinbasePro.loadOrderbook(product).then((orderbook: Orderbook) => {
//     console.log(`The orderbook has ${orderbook.numAsks} asks and ${orderbook.numBids} bids`);
// }).catch(logError);

// coinbasePro.loadBalances().then((balances: Balances) => {
//     for (const profile in balances) {
//     for (const cur in balances[profile]) {
//         const bal: AvailableBalance = balances[profile][cur];
//         console.log(`${cur}: Balance = ${bal.balance.toFixed(2)}, Available = ${bal.available.toFixed(2)}`);
//     }
//     }
// }).catch(logError);

// coinbasePro.loadAllOrders(product).then((orders) => {
//     let total = ZERO;
//     orders.forEach((o: LiveOrder) => {
//     total = total.plus(o.size);
//     });
//     console.log(`You have ${orders.length} orders on the book for a total of ${total.toFixed(1)} BTC`);
//     return coinbasePro.handleResponse(coinbasePro.authCall('GET', '/users/self', {}), {});
//     }).then((result) => {
//     console.log('Self');
//     console.log(JSON.stringify(result));
//     return coinbasePro.handleResponse(coinbasePro.authCall('GET', '/users/self/verify', {}), {});
//     }).then((result) => {
//     console.log('Self verify');
//     console.log(JSON.stringify(result));
// }).catch(logError);

const buildOrder = (orderPrice: number, orderSize: number) => {
    let order: PlaceOrderMessage = {
        time: new Date(),
        type: 'placeOrder',
        productId: 'BTC-USD',
        clientId: null,
        price: String((marketPrice - (marketPrice * buyDifferential)).toFixed(2)),
        size: String((fiatToSpend/orderPrice).toFixed(8)),
        side: 'buy',
        orderType: 'limit',
        postOnly: true
    };
    return order;
}

function logError(err: any): void {
    console.log(err.message, err.response ? `${err.response.status}: ${err.response.body.message}` : '');
}


/*
    Step 1: Check Market Price
    Step 2: Determine Limit Buy targets
    Step 3: 
*/