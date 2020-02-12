const mongoose = require("mongoose");
const fill = require('./Fill');
const Schema = mongoose.Schema;

// this will be our data base's data structure 



const OrderSchema = new Schema(
  {
    _id: String,
    id: String,
    price: Number, //big number
    size: Number, //big number
    time: Date,
    productId: String,
    status: String,
    profile_id: String,
    side: String,
    type: String,
    post_only: Boolean,
    created_at: String,
    done_at: Date,
    done_reason: String,
    settled: Boolean,
    fill_fees: String,
    filled_size: String,
    exectued_value: String,
    fills: {
      type:[fill.schema],
      default: []
    }
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Order", OrderSchema);
