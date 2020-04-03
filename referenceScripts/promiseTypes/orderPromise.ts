import { CoinbaseProExchangeAPI } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProExchangeAPI';
import { CoinbaseProConfig } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProInterfaces';
import * as CBPTT from 'coinbase-pro-trading-toolkit';

require('dotenv').config();

const logger = CBPTT.utils.ConsoleLoggerFactory();

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

module.exports = (id: string) => new Promise((resolve, reject)=>{
    coinbasePro.loadOrder(id).then((order) => {
        //console.log(order)
        //console.log(order.id+": "+order.status+" "+order.extra.status);
        let typedOrder = {};
        typedOrder = {type: "order", order};
        resolve(typedOrder);
    });
})