const express= require('express');
const routeIndex = express.Router();
const {userRoutes} = require('./user-routes');
const {authRouter} = require('./auth-routes');

routeIndex.use("/users", userRoutes);
routeIndex.use("/auth", authRouter);

module.exports = {routeIndex}


