import { LiveOrder } from 'coinbase-pro-trading-toolkit/build/src/lib/Orderbook';
import { Order, Fill } from '../../server/coinbase/interfaces/order';

export function convertOrderType(o: LiveOrder){
    let dbOrder: Order = {
        _id: o.id,
        id: o.id,
        price: Number(o.price),//.toFixed(8), //big number
        size: Number(o.size),//.toFixed(8), //big number
        time: o.time,
        productId: o.productId,
        status: o.status,
        profile_id: o.extra.profile_id,
        side: o.extra.side,
        type: o.extra.type,
        post_only: o.extra.post_only,
        created_at: o.extra.created_at,
        fill_fees: o.extra.fill_fees,
        filled_size: o.extra.filled_size,
        exectued_value: o.extra.exectued_value,
        fills: null
    }
    return dbOrder;
}

export function createFakeDbOrder(){
    let dbOrder: Order = {
        _id: "test",
        id: "test",
        price: Number(1),//.toFixed(8), //big number
        size: Number(1),//.toFixed(8), //big number
        time: new Date(),
        productId: 'BTC-USD',
        status: 'test',
        profile_id: 'c331f73c-1a9c-4385-9d55-8316b399c54f',
        side: 'buy',
        type: 'limit',
        post_only: true,
        created_at: '',
        fill_fees: '1',
        filled_size: '1',
        exectued_value: '1',
        fills: null
    }
    return dbOrder;
}

export function createFakeFill(){
    let fill: Fill = {
        created_at: '',
        trade_id: 8504200,
        product_id: 'BTC-USD',
        order_id: 'da3dd465-8daf-4da2-a9ca-5043811267d4',
        user_id: '52840c70b22e13a35c000097',
        profile_id: 'c331f73c-1a9c-4385-9d55-8316b399c54f',
        liquidity: 'M',
        price: '8079.78000000',
        size: '358.68042606',
        fee: '2318.4471462968534400',
        side: 'buy',
        settled: true,
        usd_volume: '2898058.9'
    }
    return fill;
}