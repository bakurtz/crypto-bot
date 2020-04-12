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
    if(!cronTask) console.log("Cannot kill cron. No cron is set.");
}

const set = exports.set = (config) => {
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