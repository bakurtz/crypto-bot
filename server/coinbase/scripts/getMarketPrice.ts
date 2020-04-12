import { PublicClient } from 'coinbase-pro';
require('dotenv').config();

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