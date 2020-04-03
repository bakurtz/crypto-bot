
import { AuthenticatedClient } from 'coinbase-pro';
import { CoinbaseProConfig } from 'coinbase-pro-trading-toolkit/build/src/exchanges/coinbasePro/CoinbaseProInterfaces';
import { FillFilter } from 'coinbase-pro';
import { Order, Fill } from '../../interfaces/Order';
import * as CBPTT from 'coinbase-pro-trading-toolkit';
import axios from 'axios';
require('dotenv').config();

const product = "BTC-USD";


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

let instance = axios.create({
    baseURL: process.env.API_URL,
    timeout: 10000,
    headers: {}
});

module.exports = (dbOrder: Order) => new Promise((resolve, reject)=>{
    let fillFilter: FillFilter = {
        product_id: product,
        order_id: dbOrder.id
    }
    let typedFill = {type: "fill", fills: {}};
    authClient.getFills(fillFilter).then((fills: any)  => {
        typedFill.fills = fills;
        if(fills.length>0){
            
            if( dbOrder.fills && dbOrder.fills.length === 0){
                //add All fills
                instance.post('/addFills',{params: {
                    fills,
                    orderId: dbOrder.id
                }})
                .then((resp) => {
                    console.log("Found new fills. /addFills db write failed. "+dbOrder.id);
                })
                .catch(err => console.log("Found new fills. /addFills db write failed. "+dbOrder.id));
            }
            else{
                //Compare CB and DB fills for mismatches
                console.log("Found fills for this order in db. Checking CB for updates...");
                let match = false;
                let newFills: Fill[] = []   ;
                for(let i=0;i<fills.length;i++){
                    for(let k=0;k<dbOrder.fills.length;k++){
                        if(fills[i].trade_id === dbOrder.fills[k].trade_id){
                            match = true;
                            break;
                        }
                        else{
                            match = false;
                        }
                    }
                    if(!match) newFills.push(fills[i]);
                }
                if(newFills.length>0){
                    //Get ready to add any new fills found
                    instance.post('/addFills',{params: { // CALL!
                        fills: newFills,
                        orderId: dbOrder.id
                    }})
                    .then((resp) => {
                        console.log("Updates found. /addFills db write succeeded");
                    })
                    .catch(err => console.log("/addFills db write failed."));
                }
                else{
                    console.log("No updates found on CB for "+dbOrder.id);
                }
            }
        }
        else{
            console.log("No fill data found for order "+dbOrder.id);
        }
        resolve(typedFill);
    });
})