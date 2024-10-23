require('dotenv').config();
const nodemailer = require('nodemailer');
const { errorResponse, sendResponse } = require('./response');
const responseMessage = require('./responseMessage');

const sendMailToUser = async (res, mailOptions) => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',  // Using Gmail service
        auth: {
          user: process.env.GOOGLE_MAIL_ID,
          pass: process.env.GOOGLE_MAIL_PASSWORD
        }
      });
  
      // Send mail
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return errorResponse(res, 500, 'Failed to send email.', error.message);
        } else {
          console.log('Email sent successfully:', info.response);
          return sendResponse(res, 200, 'Password reset link sent to email.');
        }
      });
      
    } catch (error) {
      console.error('Error in sendMailToUser:', error);
      return errorResponse(res, 500, 'Failed to send email.', error.message);
    }
  };
  

module.exports = sendMailToUser
