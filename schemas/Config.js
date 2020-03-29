const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Config = new Schema(
  {
    _id: String,
    id: String,
    botEnabled: Boolean,
    buySize: Number, //big number
    limitOrderDiff: Number, //big number
    cronValue: String
  }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Config", Config);
