const express = require('express');
const route = express.Router();
const userController = require('../controllers/UserController');

route.get('',userController.getAllUser);
route.get('/confirm/:token',userController.confirmAccount)
route.post('/register',userController.createUser);
route.post('/login',userController.login);

route.get('/freelancer',userController.getFreelancerByPhone);
route.get('/owner/stores',userController.getAllStoreFromOwner);

route.post('/request',userController.createRequestByFreelancer);
route.get('/request',userController.getAllRequest);
route.put('/request',userController.acceptRequest);

route.delete('/employee',userController.deleteEmployee);

module.exports = route;