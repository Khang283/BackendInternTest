const express = require('express');
const routes = express.Router();
const storeController = require('../controllers/StoreController');

routes.post('',storeController.createStore);
routes.get('',storeController.getStoreList);

module.exports = routes