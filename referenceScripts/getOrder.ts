import { CoinbaseProExchangeAPI } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProExchangeAPI';
import { CoinbaseProConfig } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProInterfaces';
import * as CBPTT from 'coinbase-pro-trading-toolkit';

require('dotenv').config();

const logger = CBPTT.utils.ConsoleLoggerFactory();

let ids: string[] = [
    "da3dd465-8daf-4da2-a9ca-5043811267d4"
    //"d78dad29-2056-4ef1-a4e3-05587b611b5f",
    //"483b2312-2e15-481b-a91c-2b735f3fe5a2",
    // "155f27fa-9c44-46fb-98ef-a6854ae2fab8",
    // "5eea6459-1d12-4586-a001-c5fa6bdbe076",
    // "df7de336-9552-480a-88ad-e8a62fefd07f",
    // "86c940eb-8984-4278-a983-e29302155c23",
    // "3e523aea-f018-4e79-af4b-6fa86675a076",
    // "08ed1d65-fa7a-4c58-b315-f1a7ee6ca61e"
]

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

ids.forEach(id=>{
    coinbasePro.loadOrder(id).then((order) => {
        console.log(order)
        //console.log(order.id+": "+order.status+" "+order.extra.status);
    });
})