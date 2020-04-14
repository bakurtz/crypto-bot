
import axios from 'axios';
import { createFakeDbOrder } from './convertOrderType';
import { Order } from '../../server/coinbase/interfaces/order';

require('dotenv').config();

let order: Order = createFakeDbOrder();
order.id = "fd8eb4b0-7953-402e-bee5-2a7da117bbe1";
order._id = "fd8eb4b0-7953-402e-bee5-2a7da117bbe1";
order.status = "pending";

let instance = axios.create({
    baseURL: process.env.API_URL,
    timeout: 10000,
    headers: {}
});

instance.post('/order/update',{order: order})
.then((resp) => {
    console.log("");
})