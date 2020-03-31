const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConfigSchema = new Schema(
  {
    _id: String,
    id: String,
    botEnabled: Boolean,
    buySize: Number, //big number
    buyType: String,
    limitOrderDiff: Number, //big number
    cronValue: String
  }
);

// export the new Schema so we could modify it using Node.js
module.exports.model = mongoose.model("Config", ConfigSchema);
module.exports.schema = ConfigSchema;