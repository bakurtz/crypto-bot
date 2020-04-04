import { CoinbaseProExchangeAPI } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProExchangeAPI';
import { CoinbaseProConfig } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProInterfaces';
import * as CBPTT from 'coinbase-pro-trading-toolkit';
require('dotenv').config();


module.exports = (id: string) => new Promise((resolve,reject)=>{
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
    console.log("HERES THE ID: ",id)
    coinbasePro.loadOrder(id).then((order) => {
        //console.log(order.id+": "+order.status+" "+order.extra.status);
        resolve(order);
    })
    .catch(err => {
        //Return error message 
        let rateLimitError = false;
        let errorMessage = JSON.parse(err.response.body).message;
        if(errorMessage.includes("rate limit")) rateLimitError = true;
        let e = {rateLimitError, errorMessage}
        console.log(e);
        reject(e)
    })
})