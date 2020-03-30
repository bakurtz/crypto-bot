const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require("path");
const Order = require('./schemas/Order');
const Fill = require('./schemas/Fill');
const Config = require('./schemas/Config');
let placeOrder = require('./functions/orderPlacer.ts');
var cron = require('node-cron');
require('dotenv').config();

let cronTask = cron.schedule('* * * * *', () => {
    console.log('Running task --> initial setup currently running every minute');
});

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


router.post('/addOrder', (req, res) => {
    let o = req.body.order;
    let myOrder = new Order({
        _id: o.id,
        id: o.id,
        price: o.price,//.toFixed(8), //big number
        size: o.size,//.toFixed(8), //big number
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
        { $push: { fills } },
        (err)=>{
        if(err) return res.json({ success: false, error: err });
        return res.json({ 
            success: true,
            message: "Written successfully." 
        });
    });


});


router.get('/getOpenOrders', (req, res) => {
    let query = {status: {$ne: "done"}};
    let sort = { createdAt : -1 };
    Order.find(query).sort(sort).then((data,err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data })
  })
});

router.get('/getAllOrders', (req, res) => {
    let query = {};
    let sort = { createdAt : -1 };
    Order.find(query).sort(sort).then((data,err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data })
    })
    .catch(err=>console.log(err))
});

router.post('/updateOrder', (req, res) => {
    let o = req.body.params.order;
    Order.findOneAndUpdate({id:req.body.params.order.id},{
      //update
        _id: o.id,
        id: o.id,
        price: o.price,//.toFixed(8), //big number
        size: o.size,//.toFixed(8), //big number
        time: o.time,
        status: o.status,
        profile_id: o.profile_id,
        side: o.side,
        type: o.type,
        post_only: o.post_only,
        created_at: o.created_at,
        fill_fees: o.fill_fees,
        filled_size: o.filled_size,
        exectued_value: o.exectued_value
  },(err, data) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, data: data })
  })
});

router.post('/placeOrder', (req, res) => {
    let differential;
    if(!req.body.params || !req.body.params.differential){
        differential = process.env.BUY_DIFFERENTIAL;
    }
    else{
        let differential = req.body.params.differential;
    }
    placeOrder(differential);
    return res.json({ success: true, data: null });
});

router.post('/syncOrders', (req, res) => {
    require('./functions/sync.ts')().then(()=>{
        console.log("WE BACK FMA!")
        return res.json({ success: true, data: null });
        
    });
});

router.get('/getDbOrder', (req, res) => {
    let orderId = req.body.orderId;
    Order.find({_id:orderId},(err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data })
    })
    .catch(err=>{
        console.log(err)
        return res.json({ success: false, error: err });
    });
});

router.get('/getCbOrder', (req, res) => {
    console.log("ORDERID: ",req.query.orderId)
    require('./serverScripts/getOrder.ts')(req.query.orderId).then(data=>{
        console.log("xxxxxxxxxxxxxxxxxxxxWe got the OrderID")
        return res.json({ success: true, data: data });
    })
    .catch(err=>{
        console.log(err)
        return res.json({ success: false, error: err });
    });
});

router.get('/getCbFills', (req, res) => {
    require('./serverScripts/getFills.ts')(req.query.orderId).then(data=>{
        return res.json({ success: true, data: data });
    })
    .catch(err=>{
        console.log(err)
        return res.json({ success: false, error: err });
    });
});

router.get('/getMarketPrice', (req, res) => {
    require('./functions/getMarketPrice.ts')().then(data=>{
        console.log("...price recvd")
        console.log("PRICE: ",data)
        return res.json({ success: true, data: data })
    })
    .catch(err=>{
        console.log(err)
        return res.json({ success: false, error: err });
    });
});

router.post('/saveConfig', (req, res) => {
    //Write new config to Mongo DB
    //Kill existing crontab task
    //Write new crontab task
    //Write new order values 
    let config = req.body.params;
    console.log(config)
    if(!config.id) config.id = (new mongoose.Types.ObjectId()).toString();
    console.log(config)
    let err = null;

    let query = { _id : new mongoose.Types.ObjectId(config.id) };

    let data = {
        id: config.id,
        botEnabled : config.botEnabled,
        buySize: config.buySize,
        limitOrderDiff: config.limitOrderDiff,
        cronValue: config.cronValue
    }

    Config.findOneAndUpdate({}, { $set : data }, {new: true}, (err, data) => {
        if (err) return res.json({ success: false, error: err });
        if(cronTask) cronTask.destroy();
        if(config.botEnabled){
            console.log("New cron set as "+ config.cronValue +" ...");
            cronTask = cron.schedule(config.cronValue, () =>  {
                console.log("cron value: "+config.cronValue);
                console.log("new buy of: $"+config.buySize);
            });
        }
        else{
            console.log("Cron destroyed...")
        }
        return res.json({ success: true, data: data })
    })
    .catch(err=>{
        console.log(err)
        return res.json({ success: false, error: err });
    });
});

router.get('/getConfig', (req, res) => {
    let query = {};
    let sort = { createdAt : -1 };
    Config.findOne(query).sort(sort).then((data,err) => {
        console.log(data)
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data })
    })
    .catch(err=>{
        console.log(err);
        return res.json({ success: false, error: err });
    })
});




// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.listen(process.env.PORT || process.env.API_PORT, () => console.log(`LISTENING ON PORT ${process.env.PORT || process.env.API_PORT}`));