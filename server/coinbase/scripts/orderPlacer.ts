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
const Order = require('../../orders/schemas/Order');
import * as CBPTT from 'coinbase-pro-trading-toolkit';
import { BigJS } from 'coinbase-pro-trading-toolkit/build/src/lib/types';
const Log = require('../../../server/common/schemas/Log');

require('dotenv').config();


module.exports = (differential: number, dollarAmt: number, orderTypeInput: string) => {
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

    coinbasePro.loadMidMarketPrice(product).then((price: BigJS) => {
        console.log("Setting Order Price to: "+(Number(price) - (Number(price) * buyDifferential)).toFixed(2));
        marketPrice = Number(price.toFixed(8));
    })
    .then(()=>{
        coinbasePro.placeOrder(buildOrder()).then((o: LiveOrder) => {
            return coinbasePro.loadOrder(o.id);
        }).then((o: any) => {
            let myOrder = new Order({
                _id: o.id,
                id: o.id,
                price: o.price,//.toFixed(8), //big number
                size: o.size,//.toFixed(8), //big number
                totalUsdSpent: dollarAmt,
                marketPrice: marketPrice,
                lastSyncDate: new Date(),
                time: o.time,
                productId: o.productId,
                status: o.status,
                profile_id: o.extra.profile_id,
                side: o.extra.side,
                type: o.extra.type,
                post_only: o.extra.post_only,
                created_at: o.extra.created_at,
                fill_fees: o.extra.fill_fees,
                filled_size: o.extra.filled_size,
                exectued_value: o.extra.exectued_value,
                fills: []
            })
            myOrder.save((err: any)=>{
                if(err) return console.log("Error writing new order data to mongodb.");
                console.log("Coinbase order placed, and successful write to local db.");
                let log = new Log.model(
                    {
                        type: "New order placed",
                        message: "New order has been placed: "+myOrder.id,
                        logLevel: "info",
                        data: JSON.stringify(myOrder)
                    }
                )
                log.save( (err: any) => {
                    if(err) console.log(err)
                })
                return;
            });
            
        }).catch(err=>{
            console.log("Error placing order on CB.")
            let failedMessage = JSON.parse(err.response.body).message;
            let log = new Log.model({ type: "Failed Order",   message: "Failed order. "+failedMessage+".",logLevel: "error",data: JSON.stringify})
            log.save((err: any)=>{
                if(err) return console.log("Error writing failed order to log.");
                return;
            })
        })
    })
}

