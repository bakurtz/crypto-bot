const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require("path");
const Order = require('./server/orders/schemas/Order');
const Fill = require('./server/orders/schemas/Fill');
const FailedOrder = require('./server/orders/schemas/FailedOrder');
const Log = require('./server/common/schemas/Log');
const Config = require('./server/profile/schemas/Config');
let placeOrder = require('./server/coinbase/scripts/orderPlacer.ts');
var cron = require('node-cron');
require('dotenv').config();

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// connects our back end code with the database
let dbString = process.env.MONGO_PROD_URL|| process.env.MONGO_URL_DEV;
mongoose.connect(dbString, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database... '+ dbString));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// USE middleware are executed every time a request is receieved
// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, "client", "build")));

//ATTACH ROUTERS


//Log Startup
let log = new Log(
    {
        type: "Startup",
        message: "Crypto bot server is launched.",
        logLevel: "info",
        data: ""
    }
)
log.save( err => {
    if(err) console.log(err)
})

let cronTask;

//Fetch crontab to initialize
Config.model.findOne({}).then((data,err) => {
    if(data && data.cronValue){
        let cronValue = data.cronValue;
        setCron(data);
    }
})




router.post('/addOrder', (req, res) => {
    let o = req.body.order;
    let myOrder = new Order({
        _id: o.id,
        id: o.id,
        price: o.price,//.toFixed(8), //big number
        size: o.size,//.toFixed(8), //big number
        totalUsdSpent: req.body.dollarAmt,
        lastSyncDate: new Date(),
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
        fills: []
    })
    myOrder.save((err)=>{
        if(err) return res.json({ success: false, error: err });
        return res.json({ 
            success: true,
            message: "Written successfully." 
        });
    });


});

router.post('/addFills', (req, res) => {
    let fills = req.body.params.fills;
    let orderId = req.body.params.orderId;
    let myFill = new Fill.model({
        fills
    });
    Order.update(
        { _id: orderId },   
        { $set: { fills, lastSyncDate: new Date() } },
        (err)=>{
        if(err) return res.json({ success: false, error: err });
        return res.json({ 
            success: true,
            message: "Written successfully." 
        });
    });


});


router.get('/getOpen', (req, res) => {
    let query = {};
    console.log("query ",req.query);
    let sort = { createdAt : -1 };
    if(req.query.byLastSync==="true") sort = { lastSyncDate: 1 }
    console.log(sort)
    query = {status: {$ne: "done"}, isArchived: {$ne: true}};
    Order.find(query).sort(sort).then((data,err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data })
  })
});

router.get('/getAll', (req, res) => {
    let query = {};
    let sort = { createdAt : -1 };
    console.log(sort);
    Order.find(query).sort(sort).then((data,err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data })
    })
    .catch(err=>console.log(err))
});

router.get('/profile/getLogs', (req, res) => {
    let query = {};
    let sort = { createdAt : -1 };
    Log.find(query).sort(sort).then((data,err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data })
    })
    .catch(err=>console.log(err))
});

router.post("/order/update", (req, res) => {
    let o = req.body.params.order;
    let options = {new: true, upsert: true, useFindAndModify: false};
    Order.findOneAndUpdate({id:req.body.params.order.id},{
      //update
        _id: o.id,
        id: o.id,
        price: o.price,//.toFixed(8), //big number
        size: o.size,//.toFixed(8), //big number
        time: o.time,
        status: o.status,
        lastSyncDate: new Date(),
        profile_id: o.profile_id,
        side: o.side,
        type: o.type,
        post_only: o.post_only,
        created_at: o.created_at,
        fill_fees: o.fill_fees,
        filled_size: o.filled_size,
        exectued_value: o.exectued_value
    },options,(err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data })
    })
});

router.post('/coinbase/placeOrder', (req, res) => {
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
});

router.post('/order/logFailed', (req, res) => {
    let o = req.body.order;
    let failedMessage = req.body.failedMessage;
    let failedOrder = new FailedOrder(
        { 
            failedMessage,
            order: {
                price: Number(o.price),
                size: Number(o.size),
                totalUsdSpent: Number(req.body.dollarAmt),
                lastSyncDate: new Date(),
                time: o.time,
                productId: o.productId
            }
        })
    failedOrder.save((err)=>{
        if(err){
            console.log(err);
            return res.json({ success: false, error: err });
        }
        let log = new Log({
            type: "Failed Order",
            message: failedMessage,
            logLevel: "error",
            data: JSON.stringify
        })
        log.save((err)=>{
            if(err) return res.json({ success: false, error: err });
            return res.json({ 
                success: true,
                message: "Written successfully." 
            });
        })
        
    });
    
});

router.post('/syncOrders', (req, res) => {
    require('./server/coinbase/scripts/sync.ts')().then(()=>{
        return res.json({ success: true, data: null });
    }).catch(err=>{console.log("Failed sync.")});
});

router.get('/getDbOrder/:orderId', (req, res) => {
    let orderId = req.params.orderId;
    Order.find({_id:orderId},(err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data })
    })
    .catch(err=>{
        console.log(err)
        return res.json({ success: false, error: err });
    });
});

router.get('/getCbOrder/:orderId', (req, res) => {
    console.log("ORDERID: ",req.query.orderId)

    require('./server/coinbase/scripts/getOrder.ts')(req.query.orderId).then(data=>{
        return res.json({ success: true, data: data });
    })
    .catch(err=>{
        console.log(err)
        return res.json({ success: false, error: err });
    });
});

router.post('/archiveOrder', (req, res) => {
    let o = req.body.params.order;
    let options = {useFindAndModify: false};
    Order.findOneAndUpdate(
        {id:req.body.params.id},
        {$set: {
            lastSyncDate: new Date(),
            isArchived: true,
            status: "archived"
            }
        }, 
        options,
        (err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data })
    })
})

router.get('/getCbFills', (req, res) => {
    require('./server/coinbase/scripts/getFills.ts')(req.query.orderId).then(data=>{
        return res.json({ success: true, data: data });
    })
    .catch(err=>{
        console.log(err)
        return res.json({ success: false, error: err });
    });
});

router.get('/getMarketPrice', (req, res) => {
    require('./server/coinbase/scripts/getMarketPrice.ts')().then(data=>{
        console.log("PRICE: ",data)
        return res.json({ success: true, data: data })
    })
    .catch(err=>{
        console.log(err)
        return res.json({ success: false, error: err });
    });
});

router.get('/getAccountBalances', (req, res) => {
    require('./server/coinbase/scripts/getAccountInfo.ts')().then(data=>{
        return res.json({ success: true, data: data })
    })
    .catch(err=>{
        console.log(err)
        return res.json({ success: false, error: err });
    });
});

router.post('/saveConfig', (req, res) => {
    let config = req.body.params;
    
    if(!config.id) config.id = (new mongoose.Types.ObjectId()).toString();
    let err = null;

    let data = {
        _id: config.id,
        id: config.id,
        botEnabled : config.botEnabled,
        buySize: config.buySize,
        limitOrderDiff: config.limitOrderDiff,
        cronValue: config.cronValue,
        buyType: config.buyType
    }
    let options = {new: true, upsert: true, useFindAndModify: false};

    Config.model.findOneAndUpdate({}, data, options, (err, data) => {
        if (err) return res.json({ success: false, error: err });
        if(cronTask) cronTask.destroy();
        let errorText = "";
        setCron(config);
        let log = new Log({
            type: "Config change",
            message: "New config saved",
            logLevel: "low",
            data: JSON.stringify(config)
        })
        log.save((err)=>{
            if(err) {
                console.log(err)
            }
        })
        return res.json({ success: true, data: data });
    })
});

router.get('/getConfig', (req, res) => {
    let query = {};
    let sort = { createdAt : -1 };
    Config.model.findOne(query).sort(sort).then((data,err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data })
    })
});

const setCron = (config) => {
    if(config.botEnabled){
        if(cron.validate(config.cronValue)){
            cronTask = cron.schedule(config.cronValue, () =>  {
                placeOrder(config.limitOrderDiff, config.buySize, config.buyType);
            })
            let log = new Log(
                {type: "Crontab set", message: "New cron task strarted: "+config.cronValue,logLevel: "info", data: config.cronValue}
            )
            log.save( err => {
                if(err) console.log(err)
            })
        }
        else{
            errorText = "Invalid cron entry."
            console.log(errorText);
            return res.json({ success: false, error: errorText });
        }
    }
    else{
        if(cronTask) {
            cronTask.destroy();
            let log = new Log(
                {type: "Crontab destroyed", message: "Cron job destroyed.",logLevel: "info", data: config.cronValue}
            )
            log.save( err => {
                if(err) console.log(err)
            })
        }
    }
}




// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.listen(process.env.PORT || process.env.API_PORT, () => console.log(`LISTENING ON PORT ${process.env.PORT || process.env.API_PORT}`));