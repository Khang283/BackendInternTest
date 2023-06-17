const userRoutes = require('./user');
const storeRoutes = require('./store');

function Routes(app){
    app.use('/api/v1/users',userRoutes)
    app.use('/api/v1/store',storeRoutes);
}

module.exports = Routes;