
import { AuthenticatedClient } from 'coinbase-pro';
import { CoinbaseProConfig } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProInterfaces';
import { FillFilter } from 'coinbase-pro';
import * as CBPTT from 'coinbase-pro-trading-toolkit';
require('dotenv').config();

const product = "BTC-USD";
let fillPromises: any[] = [];

let ids: string[] = [
    "fd8eb4b0-7953-402e-bee5-2a7da117bbe1",
    //"fd8eb4b0-7953-402e-bee5-2a7da117bbe1"
    //"d78dad29-2056-4ef1-a4e3-05587b611b5f",
    //"b0ff01a4-c405-4c29-9887-566938ed277e",
    // "483b2312-2e15-481b-a91c-2b735f3fe5a2",
    // "155f27fa-9c44-46fb-98ef-a6854ae2fab8",
    // "5eea6459-1d12-4586-a001-c5fa6bdbe076",
    // "df7de336-9552-480a-88ad-e8a62fefd07f",
    // "86c940eb-8984-4278-a983-e29302155c23",
    // "3e523aea-f018-4e79-af4b-6fa86675a076",
    // "08ed1d65-fa7a-4c58-b315-f1a7ee6ca61e"
]

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


for(let i=0;i<15;i++){
ids.forEach(id=>{
    let fillFilter: FillFilter = {
        product_id: product,
        order_id: id
    }
    fillPromises.push(authClient.getFills(fillFilter))
    
})
}
Promise.all(fillPromises).then((res: any)  => {
    console.log(res);
})