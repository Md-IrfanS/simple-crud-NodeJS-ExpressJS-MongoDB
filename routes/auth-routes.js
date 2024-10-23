const express = require('express');
const { postRegister, login, postForgotPassword, postResetPassword } = require("../controllers/user-controllers");
const { emailService } = require('../utils/services/emailService');

const authRouter = express.Router();

// Initialize email service and verify connection
let emailServiceReady = false;
(async () => {
  emailServiceReady = await emailService.verifyConnection();
})();

// Middleware to check email service status
const checkEmailService = (req, res, next) => {
  if (!emailServiceReady) {
    return res.status(503).json({
      error: 'Email service unavailable',
      details: 'The email service is not properly configured or is down'
    });
  }
  next();
};

authRouter.post('/register-user', postRegister);
authRouter.post('/login', login);
authRouter.post('/forgot-password', checkEmailService, postForgotPassword);
authRouter.post("/reset-password/:token", postResetPassword);

module.exports = {authRouter}