// import { CoinbaseProExchangeAPI } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProExchangeAPI';
// import { CoinbaseProConfig } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProInterfaces';
// import { BigJS } from 'coinbase-pro-trading-toolkit/build/src/lib/types'; 
//import * as CBPTT from 'coinbase-pro-trading-toolkit';
import { PublicClient } from 'coinbase-pro';
//import { PriceLevelFactory } from 'coinbase-pro-trading-toolkit/build/src/lib';
require('dotenv').config();

//const logger = CBPTT.utils.ConsoleLoggerFactory();
const product = "BTC-USD";

module.exports = () => new Promise((resolve,reject)=>{
    const publicClient = new PublicClient(process.env.COINBASE_PRO_API_URL);

    publicClient.getProductTicker(product).then((resp)=>{
        console.log("GET PRODUCT TCKER ---> ", resp.price);
        resolve(resp.price);
    }).catch(err => console.log(err));


    /*
        Private API Method
    */

    // const coinbaseProConfig: CoinbaseProConfig = {
    //     logger: logger,
    //     apiUrl: process.env.COINBASE_PRO_API_URL || 'https://api.pro.coinbase.com',
    //     auth: {
    //         key: process.env.COINBASE_PRO_KEY,
    //         secret: process.env.COINBASE_PRO_SECRET,
    //         passphrase: process.env.COINBASE_PRO_PASSPHRASE
    //     }
    // }
    // const coinbasePro = new CoinbaseProExchangeAPI(coinbaseProConfig);

    // coinbasePro.loadMidMarketPrice(product).then((price: BigJS) => {
    //     console.log("=============");
    //     console.log("Market Price: "+price);
    //     console.log("=============");
    //     //marketPrice = Number(price.toFixed(8));
    //     resolve(price);
    // }).catch(err => console.log(err));
})