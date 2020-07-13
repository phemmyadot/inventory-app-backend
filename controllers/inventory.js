const { validationResult } = require('express-validator');

const Inventory = require('../models/inventory');

exports.fetchAllInventories = (req, res, next) => {
  const currentPage = +req.query.currentPage || 1;
  const pageSize = +req.query.pageSize || 5;
  let totalInventories;
  Inventory.find().countDocuments()
    .then(count => {
      totalInventories = count;
      return Inventory.find()
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize);
    })
    .then(inventories => {
      res
        .status(200)
        .json({ message: 'Fetch Successful!', inventories, totalInventories });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

};


exports.fetchInventoryById = (req, res, next) => {
  const inventoryId = req.params.id;
  Inventory.findById(inventoryId)
    .then(inventory => {
      if (!inventory) {
        const error = new Error('Could not find inventory!');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: `${inventory.name} found!`, inventory });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.searchInventory = (req, res, next) => {
  const inventoryName = req.query.name;
  Inventory.find({ "name": { "$regex": inventoryName, "$options": "i" } })
    .then(inventory => {
      console.log(inventory)
      if (inventory.length === 0) {
        const error = new Error('Could not find inventory!');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: `${inventory.length} ${inventory.length > 0 ? 'inventories' : 'inventory'} found!`, inventory });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.createInventory = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const name = req.body.name;
  const stockedQuantity = req.body.stockedQuantity;
  const availableQuantity = req.body.availableQuantity;
  const price = req.body.price;
  const modelNo = req.body.model;

  const inventory = new Inventory({
    name,
    stockedQuantity,
    availableQuantity,
    price,
    modelNo
  });
  inventory
    .save()
    .then(response => {
      res.status(201).json({
        message: 'Inventory Created Successfully!',
        inventory: response
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.updateInventory = (req, res, next) => {
  const inventoryId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const name = req.body.name;
  const stockedQuantity = req.body.stockedQuantity;
  const availableQuantity = req.body.availableQuantity;
  const price = req.body.price;
  const model = req.body.model;

  Inventory.findById(inventoryId)
    .then(inventory => {
      if (!inventory) {
        const error = new Error('Could not find inventory!');
        error.statusCode = 404;
        throw error;
      }
      inventory.name = name;
      inventory.stockedQuantity = stockedQuantity;
      inventory.availableQuantity = availableQuantity;
      inventory.price = price;
      inventory.modelNo = model;
      return inventory.save();
    })
    .then(result => {
      res.status(200).json({ message: 'inventory updated!', inventory: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.removeInventory = (req, res, next) => {
  const inventoryId = req.params.id;
  Inventory.findById(inventoryId)
    .then(inventory => {
      if (!inventory) {
        const error = new Error('Could not find inventory!');
        error.statusCode = 404;
        throw error;
      }
      return Inventory.findByIdAndRemove(inventoryId);
    })
    .then(result => {
      res.status(200).json({ message: `${result.name} deleted!` })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}