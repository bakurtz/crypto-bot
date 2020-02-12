import { PublicClient } from 'coinbase-pro';
require('dotenv').config();



const publicClient = new PublicClient(process.env.COINBASE_PRO_API_URL);

publicClient.getProducts().then((resp)=>{
    resp.forEach(prd => {
        console.log(prd.id)
    })
}).catch(err => console.log(err));

