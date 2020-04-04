const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LogSchema = new Schema(
  {
    type: String, //FailedOrder
    logLevel: String, //insufficientfunds
    message: String, //insufficientfunds
    data: String
  },{ timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Log", LogSchema)