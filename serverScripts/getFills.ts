
import { AuthenticatedClient } from 'coinbase-pro';
import { CoinbaseProConfig } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProInterfaces';
import { FillFilter } from 'coinbase-pro';
import * as CBPTT from 'coinbase-pro-trading-toolkit';
require('dotenv').config();

const product = "BTC-USD";

module.exports = (id: string) => new Promise((resolve,reject)=>{
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
    let authClient = new AuthenticatedClient(coinbaseProConfig.auth.key, coinbaseProConfig.auth.secret, coinbaseProConfig.auth.passphrase, coinbaseProConfig.apiUrl);



    let fillFilter: FillFilter = {
        product_id: product,
        order_id: id
    }
    authClient.getFills(fillFilter).then((fills: any)  => {
        resolve(fills);
    })
    .catch((err: any)=>console.log(err))
})