const cron = require('node-cron');  
const Log = require('../common/schemas/Log');
const Config = require('../profile/schemas/Config');
const placeOrder = require('../coinbase/scripts/orderPlacer.ts');


let cronTask;
let cronArray = [];
let newTask;


const initialize = exports.initialize = () =>{
    // Loop thru all configs for BOTENABLED
    // Schedule Each individual cron 
    Config.model.find({isActive:true}).then((data,err) => {
        if(data){
            data.forEach(c => {
                if(c.cronValue && c.botEnabled){
                    set(c);
                }
            })
        }
    })
}

const kill = exports.kill = () => {
    if(cronTask) {
        cronTask.destroy();
        console.log("Cron destroyd!")
    }
}

const getAll = exports.getAll = () => {
    let tasklessCrons = [];
    let cronItem = {};
    cronArray.forEach(c=>{
        cronItem.id = c.id;
        cronItem.schedule = c.schedule;
        tasklessCrons.push(cronItem);
        cronItem = {};
    })
    return tasklessCrons;
}

const set = exports.set = (config, token) => {
    if(config.botEnabled){
        if(cron.validate(config.cronValue)){
            //Kill existing cron if one exists
            for(let i = cronArray.length-1; i>=0; i--){
                if(cronArray[i].id == config.id) {
                    cronArray[i].task.destroy();
                    cronArray.splice(i,1);
                }
            }
            newTask = cron.schedule(config.cronValue, () =>  {
                placeOrder(config.id, config.limitOrderDiff, config.buySize, config.buyType, token);
            });
            cronArray.push({id: config.id, task: newTask, schedule: config.cronValue})
            console.log("New cron set for "+config.id+": "+config.cronValue)
            let log = new Log.model({type: "Crypto-bot enabled", message: "Crypto-bot enabled with cron: "+config.cronValue,logLevel: "info", data: config.cronValue})
            log.save( err => { if(err) console.log(err) })
            //CHECK ARRAY
            console.log("~~~CronArray has been Updated:")
            cronArray.forEach(c=>{
                console.log(c.id,c.schedule,c.task.getStatus())
            })
            console.log("~~~")
        }
        else{
            errorText = "Invalid cron entry."
            console.log(errorText);
            return res.json({ success: false, error: errorText});
        }
    }
    else{
        //Find cron task and kill it
        for(let i = cronArray.length-1; i>=0; i--){
            if(cronArray[i].id == config.id) {
                cronArray[i].task.destroy();
                cronArray.splice(i,1)
                let log = new Log.model(
                    {type: "Disabled schedule", message: "Disabled "+config.id,logLevel: "info", data: config.cronValue}
                )
                log.save( err => {
                    if(err) console.log(err)
                })
            }
        }
        console.log("~~~CronArray has been Updated:")
            cronArray.forEach(c=>{
                console.log(c.id,c.schedule,c.task.getStatus())
            })
        console.log("~~~")
    }
}

