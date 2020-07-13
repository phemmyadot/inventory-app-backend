const mongoose = require('mongoose');
const { Double } = require('mongodb');
const Schema = mongoose.Schema;

const inventorySchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    stockedQuantity: {
      type: Number
    },
    price: {
      type: Number,
      required: true
    },
    availableQuantity: {
      type: Number
    },
    modelNo: {
      type: String,
      required: true
    },
    //Image Upload
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);