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
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    availableQuantity: {
      type: Number,
      required: true
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