const crypto = require('crypto');
const Config = require('../schemas/Config');
const Log = require('../../common/schemas/Log');
const cron = require('../../cron/cron');
const mongoose = require("../../common/services/mongoose.service").mongoose;

exports.listLogs = (req, res) => {
    let query = {};
    let sort = { createdAt : -1 };
    Log.model.find(query).sort(sort).then((data,err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data })
    })
    .catch(err=>console.log(err))
};

exports.getConfig = (req, res) => {
    let query = {};
    let sort = { createdAt : -1 };
    console.log("YOOO")
    Config.model.findOne(query).sort(sort).then((data,err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data })
    })
};

exports.saveConfig = (req, res) => {
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
        cron.kill();
        cron.set(config);
        let log = new Log.model({
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
};
