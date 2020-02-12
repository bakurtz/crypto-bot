import { CoinbaseProExchangeAPI } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProExchangeAPI';
import { CoinbaseProConfig } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProInterfaces';
import * as CBPTT from 'coinbase-pro-trading-toolkit';
import { BigJS } from 'coinbase-pro-trading-toolkit/build/src/lib/types'; 
import { PublicClient } from 'coinbase-pro';
require('dotenv').config();

const logger = CBPTT.utils.ConsoleLoggerFactory();
const product = "BTC-USD";



const publicClient = new PublicClient(process.env.COINBASE_PRO_API_URL);

publicClient.getProductTicker(product).then((resp)=>{
    console.log(resp);
}).catch(err => console.log(err));



const coinbaseProConfig: CoinbaseProConfig = {
    logger: logger,
    apiUrl: process.env.COINBASE_PRO_API_URL || 'https://api.pro.coinbase.com',
    auth: {
        key: process.env.COINBASE_PRO_KEY,
        secret: process.env.COINBASE_PRO_SECRET,
        passphrase: process.env.COINBASE_PRO_PASSPHRASE
    }
}
const coinbasePro = new CoinbaseProExchangeAPI(coinbaseProConfig);

coinbasePro.loadMidMarketPrice(product).then((price: BigJS) => {
    console.log("=============");
    console.log("Market Price: "+price);
    console.log("=============");
    //marketPrice = Number(price.toFixed(8));
}).catch(err => console.log(err));
