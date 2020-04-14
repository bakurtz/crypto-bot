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
    let token = "";
    if (req.headers['authorization']) {
        let authorization = req.headers['authorization'].split(' ');
        token = authorization[1];
    }
    require('../scripts/sync.ts')(token).then(()=>{
        return res.json({ success: true, data: null });
    }).catch(err=>{
        console.log("Failed sync.")
        return res.json({ success: false, error: err });
    });
};

exports.getFills = (req, res) => {
    require('../scripts/getFills.ts')(req.params.orderId).then(data=>{
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

exports.getOrder = (req, res) => {
    require('../scripts/getOrder.ts')(req.params.orderId).then(data=>{
        return res.json({ success: true, data: data });
    })
    .catch(err=>{
        console.log(err)
        return res.json({ success: false, error: err });
    });
}