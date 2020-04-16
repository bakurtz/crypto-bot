const cron = require('node-cron');  
const Log = require('../common/schemas/Log');
const Config = require('../profile/schemas/Config');
const placeOrder = require('../coinbase/scripts/orderPlacer.ts');


let cronTask;

const initialize = exports.initialize = () =>{
    Config.model.findOne({}).then((data,err) => {
        if(data && data.cronValue){
            let cronValue = data.cronValue;
            set(data);
        }
    })
}

const kill = exports.kill = () => {
    if(cronTask) {
        cronTask.destroy();
        console.log("Cron destroyd!")
    }
}

const set = exports.set = (config, token) => {
    if(config.botEnabled){
        if(cron.validate(config.cronValue)){
            cronTask = cron.schedule(config.cronValue, () =>  {
                placeOrder(config.limitOrderDiff, config.buySize, config.buyType, token);
            })
            console.log("New cron set: "+config.cronValue)
            let log = new Log.model({type: "Crypto-bot enabled", message: "Crypto-bot enabled with cron: "+config.cronValue,logLevel: "info", data: config.cronValue})
            log.save( err => { if(err) console.log(err) })
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
            let log = new Log.model(
                {type: "Crypto-bot disabled", message: "Crypto-bot disabled.",logLevel: "info", data: config.cronValue}
            )
            log.save( err => {
                if(err) console.log(err)
            })
        }
    }
}