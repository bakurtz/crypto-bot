/*
    PLACE ORDER
    RETURN ORDER DETAILS
    CANCEL ORDER
*/
import { CoinbaseProExchangeAPI } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProExchangeAPI';
import { CoinbaseProConfig } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProInterfaces';
import { PlaceOrderMessage } from 'coinbase-pro-trading-toolkit/build/src/core/Messages';
import { LiveOrder } from 'coinbase-pro-trading-toolkit/build/src/lib/Orderbook';
import * as CBPTT from 'coinbase-pro-trading-toolkit';


require('dotenv').config();

const logger = CBPTT.utils.ConsoleLoggerFactory();
const product = "BTC-USD";


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

const buildOrder = () => {
    let order: PlaceOrderMessage = {
        time: new Date(),
        type: 'placeOrder',
        productId: product,
        clientId: null,
        price: String(8138.70),
        size: String(24),
        side: 'buy',
        orderType: 'limit',
        postOnly: true
    };
    return order;
}

coinbasePro.placeOrder(buildOrder()).then((o: LiveOrder) => {
    console.log(`Order ${o.id} successfully placed`);
    return coinbasePro.loadOrder(o.id);
}).then((o) => {
    console.log(`Order status: ${o.status}, ${o.time}`);
    console.log(o.id);
    //return coinbasePro.cancelOrder(o.id);
})
// .then((id) => {
//     console.log(`Order ${id} has been cancelled`);
// }).catch((err)=>console.log(err));


