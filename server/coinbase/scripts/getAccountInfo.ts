import { CoinbaseProExchangeAPI } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProExchangeAPI';
import { CoinbaseProConfig } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProInterfaces';
const cbpConfig = require('../common/cbpConfig');
require('dotenv').config();

module.exports = (id: string) => new Promise((resolve,reject)=>{
    const coinbaseProConfig: CoinbaseProConfig = cbpConfig();
    const coinbasePro = new CoinbaseProExchangeAPI(coinbaseProConfig);
    coinbasePro.loadBalances().then( (resp) =>{
        console.log(resp)
        resolve({
            btc: resp[Object.keys(resp)[0]].BTC.available.toString(),
            usd: resp[Object.keys(resp)[0]].USD.available.toString()
        }) 
    })
})