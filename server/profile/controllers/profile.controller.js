const UserModel = require('../models/users.model');
const crypto = require('crypto');

exports.listLogs = (req, res) => {
    let query = {};
    let sort = { createdAt : -1 };
    Log.find(query).sort(sort).then((data,err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data })
    })
    .catch(err=>console.log(err))
    
};

exports.getConfig = (req, res) => {
    let query = {};
    let sort = { createdAt : -1 };
    Config.model.findOne(query).sort(sort).then((data,err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data })
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
};
