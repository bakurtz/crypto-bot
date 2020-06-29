const Product = require('../../profile/schemas/Product');
const Config = require('../../profile/schemas/Config');
const crypto = require('crypto');

exports.refreshAvailableProducts = (req, res) => {
    console.log("AJlsd;jgl;dsf!!!!!!!!!!!!!!!!!!~~~~~~~~~~~~~~~~~~")
    let configs;
    let config;
    Config.model.find({}).then(results=>{
        configs = results;
        console.log(configs)
        res.status(200).send({data: configs});  
    })
    require('../../coinbase/scripts/getProducts.ts')().then(products=>{
        products.forEach(p=>{
            for(let i=0;i<configs.length;i++){
                //if there is a match already
                if(configs[i].id==p.id){
                    return;
                }
                //No match, and on last item, so we can assume this is new and needs an insert
                if(i==configs.length-1){
                    config = new Config.model({
                        id: p.id,
                        product: new Product.model(p),
                        botEnabled: false,
                        buySize: 0, //big number
                        buyType: "Limit",
                        limitOrderDiff: 1, //big number
                        cronValue: "0 0 1 1 1",
                        isActive: false, //User has set this active
                        isAvailable: true,
                        product: new Product.model(p)
                    })
                    //let product = new Product.model(p);
                    config.save().then(res=>{
                        if(res) console.log("WOOT!!",res)
                    }).catch(err => console.log(err))
                }
            }
            
        })      
    })
};

exports.updateProductConfig = (req, res) => {
    console.log("UPDATING PRODUCT CONFIG...")
    req.body.params.forEach(p=>{
        let product = new Product.model(p);
        Product.model.findOneAndUpdate(
            { id: p.id },
            { $set: { cancel_only: p.cancel_only } },
            { upsert: true, new: true },
            (err,res)=>{
                if(err) console.log(err)
                console.log("Successfully wrote product!");
            }
        )
    })
    res.status(200).send({data: null});
};

exports.getSelectedProducts = (req, res) => {
    console.log("INSER SELECTED PRODS")
};