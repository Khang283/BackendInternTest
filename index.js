const express = require('express');
const {sequelize,Address,User} = require('./models');
const { Op } = require('sequelize');
const app = express();
const Routes = require('./routes/index');
const PORT = 5000;

app.use(express.json());

Routes(app);

app.listen(PORT , async ()=>{
    await sequelize.authenticate();
    console.log("Database connected");
    console.log(`Server start on port ${PORT}`);
})