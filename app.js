const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Controller = require('./controllers/inventory');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.route('/inventories')
    .get((req, res, next) => {
        Controller.fetchAllInventories(req, res, next);
    })
    .post((req, res, next) => {
        Controller.createInventory(req, res, next);
    });

app.get('/inventories/search', (req, res, next) => {
    Controller.searchInventory(req, res, next);
});

app.route('/inventories/:id')
.put((req, res, next) => {
    Controller.updateInventory(req, res, next);
})
.get((req, res, next) => {
    Controller.fetchInventoryById(req, res, next);
})
.delete((req, res, next) => {
    Controller.removeInventory(req, res, next);
});


app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});
const uri = process.env.MONGODB_CONNECT || 'mongodb+srv://codevillian:1qhhmfSUDW3ACwlM@cluster0-9jwcj.mongodb.net/inventoryApp?retryWrites=true&w=majority';

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0
};
mongoose
    .connect(uri, options)
    .then(result => {
        console.log('connected to =>', uri);
        app.listen(process.env.PORT || 8080);
    })
    .catch(err => console.log(err, 'error'));