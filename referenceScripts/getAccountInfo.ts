import { CoinbaseProExchangeAPI } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProExchangeAPI';
import { CoinbaseProConfig } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProInterfaces';
//import { Balances } from 'coinbase-pro-trading-toolkit/build/src/exchanges/AuthenticatedExchangeAPI.d';
import * as CBPTT from 'coinbase-pro-trading-toolkit';
//import Big from 'bignumber.js';

require('dotenv').config();
const logger = CBPTT.utils.ConsoleLoggerFactory();

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
coinbasePro.loadBalances().then( (resp) =>{
    //let y: string = "c331f73c-1a9c-4385-9d55-8316b399c54f";
    
    resp[Object.keys(resp)[0]].BTC.balance.toString();
    resp[Object.keys(resp)[0]].BTC.balance.toNumber();
    console.log(resp)
    console.log("BTC: "+resp[Object.keys(resp)[0]].BTC.balance.toString())
    console.log("BTC: "+resp[Object.keys(resp)[0]].BTC.balance.toNumber())
    console.log("USD: $"+resp[Object.keys(resp)[0]].USD.balance.toString())
    console.log("USD: $"+resp[Object.keys(resp)[0]].USD.available.toString())
})