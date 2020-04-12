const mongoose = require("mongoose");
const order = require('./Order');
const Schema = mongoose.Schema;

// this will be our data base's data structure 

const FailedOrderSchema = new Schema(
  {
    failedMessage: String,
    order: {
      type:[order.schema],
      default: []
    }
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("FailedOrder", FailedOrderSchema);
