export interface Order{
    _id: string,
    id: string,
    price: number, //big number
    size: number, //big number
    time: Date,
    productId: string,
    status: string,
    profile_id: string,
    side: string,
    type: string,
    post_only: boolean,
    created_at: string,
    done_at?: Date,
    done_reason?: string,
    fill_fees: string,
    filled_size: string,
    exectued_value: string,
    settled?: boolean,
    fills: Fill[]
}

export interface Fill{
    created_at: string,
    trade_id: number, //big number
    product_id: string, //big number
    order_id: string,
    user_id: string,
    profile_id: string,
    liquidity: string,
    price: string,
    size: string,
    fee: string,
    side: string,
    settled: boolean,
    usd_volume: string
}