const express = require('express');
const { postRegister, login, postForgotPassword, postResetPassword } = require("../controllers/user-controllers");

const authRouter = express.Router();

authRouter.post('/register-user', postRegister);
authRouter.post('/login', login);
authRouter.post('/forgot-password', postForgotPassword);
authRouter.post("/reset-password/:token", postResetPassword);

module.exports = {authRouter}