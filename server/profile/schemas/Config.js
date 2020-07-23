const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const product = require('./Product');

const ConfigSchema = new Schema(
  {
    id: String,
    product: {
      type:product.schema,
      default: {}
    },
    botEnabled: Boolean,
    buySize: Number, //big number
    buyType: String,
    limitOrderDiff: Number, //big number
    cronValue: String,
    isActive: Boolean, //User has set this active
    isAvailable: Boolean, //User has this product available in API
    isDefault: Boolean,
    icon: {data: Buffer, contentType: String}
  }
);

// export the new Schema so we could modify it using Node.js
module.exports.model = mongoose.model("Config", ConfigSchema);
module.exports.schema = ConfigSchema;