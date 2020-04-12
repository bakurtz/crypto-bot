const UserModel = require('../models/users.model');
const crypto = require('crypto');
let placeOrder = require('../scripts/orderPlacer.ts');

exports.placeOrder = (req, res) => {
    let differential;
    if(!req.body.params || !req.body.params.differential){
        differential = process.env.BUY_DIFFERENTIAL;
    }
    else{
        let differential = req.body.params.differential;
        let dollarAmt = req.body.params.buySize;
        let orderType = req.body.params.orderType;
    }
    placeOrder(differential, dollarAmt, orderType);
    return res.json({ success: true, data: null });
};

exports.syncOrders = (req, res) => {
    require('../scripts/sync.ts')().then(()=>{
        return res.json({ success: true, data: null });
    }).catch(err=>{console.log("Failed sync.")});
};

exports.getFills = (req, res) => {
    require('../scripts/getFills.ts')(req.query.orderId).then(data=>{
        return res.json({ success: true, data: data });
    })
    .catch(err=>{
        console.log(err)
        return res.json({ success: false, error: err });
    });
};

exports.getMarketPrice = (req, res) => {
    require('../scripts/getMarketPrice.ts')().then(data=>{
        console.log("PRICE: ",data)
        return res.json({ success: true, data: data })
    })
    .catch(err=>{
        console.log(err)
        return res.json({ success: false, error: err });
    });
}

exports.getAccountBalances = (req, res) => {
    require('../scripts/getAccountInfo.ts')().then(data=>{
        return res.json({ success: true, data: data })
    })
    .catch(err=>{
        console.log(err)
        return res.json({ success: false, error: err });
    });
}