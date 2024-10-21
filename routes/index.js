const express= require('express');
const routeIndex = express.Router();
const {userRoutes} = require('./user-routes');

routeIndex.use("/users", userRoutes);

module.exports = {routeIndex}


