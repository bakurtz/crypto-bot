/*
    The purpose of this script is to
    - Check market price
    - Build and execute a LIMIT order
    - Push order details to MongoDB
*/
import { CoinbaseProExchangeAPI } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProExchangeAPI';
import { CoinbaseProConfig } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProInterfaces';
import { PlaceOrderMessage } from 'coinbase-pro-trading-toolkit/build/src/core/Messages';
import { OrderType } from 'coinbase-pro-trading-toolkit/build/src/core/Messages';
import { LiveOrder } from 'coinbase-pro-trading-toolkit/build/src/lib/Orderbook';
import * as CBPTT from 'coinbase-pro-trading-toolkit';
const Log = require('../schemas/Log');
import { BigJS } from 'coinbase-pro-trading-toolkit/build/src/lib/types';   
import axios from 'axios';


require('dotenv').config();

module.exports = function (differential: number, dollarAmt: number, orderTypeInput: string){
    const logger = CBPTT.utils.ConsoleLoggerFactory();
    const product = "BTC-USD";
    let marketPrice: number;
    let buyDifferential: number = Number(differential/100); //convert differential from % to decimal    


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

    let instance = axios.create({
        baseURL: process.env.API_URL,
        timeout: 10000,
        headers: {}
    });



    coinbasePro.loadMidMarketPrice(product).then((price: BigJS) => {
        console.log("Setting Order Price to: "+(Number(price) - (Number(price) * buyDifferential)).toFixed(2));
        marketPrice = Number(price.toFixed(8));
    })
    .then(()=>{
        coinbasePro.placeOrder(buildOrder()).then((o: LiveOrder) => {
            return coinbasePro.loadOrder(o.id);
        }).then((order: any) => {
            instance.post('/addOrder', {
                order,
                dollarAmt
            })
            .then((response) => {console.log("Coinbase order placed, and successful write to local db.")})
            .catch(err => console.log("Coinbase success, but failed to write order to local DB.",err))
            let log = new Log(
                {
                    type: "New order placed",
                    message: "New order has been placed: "+order.id,
                    logLevel: "info",
                    data: JSON.stringify(order)
                }
            )
            log.save( (err: any) => {
                if(err) console.log(err)
            })
        }).catch((err: any)=>{
            let failedMessage = JSON.parse(err.response.body).message;
            console.log(failedMessage)
            let order = buildOrder();
            instance.post('/logFailedOrder', {
                order,
                dollarAmt,
                failedMessage
            })
            .then((response) => {console.log("Failed order. Successful API CALL")})
            .catch(err => console.log("Attempt to write failed order to DB failed."))
        });
    })
    .catch((err)=>{
        console.log(err)
    });

    const buildOrder = () => {
        let otype: OrderType;
        if(orderTypeInput.toLowerCase()==='limit') otype = 'limit';
        if(orderTypeInput.toLowerCase()==='market') otype = 'market';
        let orderPrice: number = (marketPrice - (marketPrice * buyDifferential));
        let order: PlaceOrderMessage = {
            time: new Date(),
            type: 'placeOrder',
            productId: product,
            clientId: null,
            price: orderPrice.toFixed(2),
            size: (dollarAmt/orderPrice).toFixed(8),
            side: 'buy',
            orderType: otype,
            postOnly: true
        };
        return order;
    }
}
