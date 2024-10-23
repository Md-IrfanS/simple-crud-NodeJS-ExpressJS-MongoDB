require('dotenv').config(); 
const User = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendResponse, errorResponse } = require('../utils/response');
const responseMessage = require("../utils/responseMessage");
const nodemailer = require('nodemailer');
const { emailService } = require('../utils/services/emailService');
const crypto = require('crypto');

const postRegister = async (req, res) => {
  const {userName, email, password, userType = 1, gender = "", mobile = ""} = req.body;

    // Check if the required fields are filled
    if (!userName || !email || !password || !gender || !mobile) {
      return errorResponse(res, 400, responseMessage.users.failed_register,responseMessage.users.failed_register);
    }
  try{
    const existingUser = await User.findOne({
      $or: [{userName: userName},{email: email}]
    });
    console.log(existingUser);

    if (existingUser) {
      return sendResponse(res, 400, responseMessage.users.failed_user_exists, responseMessage.users.failed_user_exists);
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({userName: userName, email, password: hashPassword, userType, gender, mobile});
    await newUser.save();
    return sendResponse(res, 201, responseMessage.users.success_register, newUser);
  }catch(error){
    // Check if the error is due to a unique constraint (duplicate email)
    if (error.code === 11000) {
      const duplicateKey = Object.keys(error.keyValue)[0]; // 'userName' or 'email'
      return errorResponse(res, 400, 'Duplicate email error', `${duplicateKey} Email is already registered.`);
    }
    
    // Generic error handling
    return errorResponse(res, 500, 'Error registering user', error.message);  
  }
};

const login = async (req, res) => {
  const {email, password} = req.body;
  console.log(email, password);
  try{
    const user = await User.findOne({email});
    console.log(user,'login');
    if (!user) {
      return errorResponse(res, 400, responseMessage.users.login_failed,responseMessage.users.login_failed);      
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return errorResponse(res, 400, responseMessage.users.login_failed,responseMessage.users.login_failed);      
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
    return sendResponse(res, 200, responseMessage.users.success_login, { token: token, userDetails: user});
  }catch(error){
    return errorResponse(res, 500, responseMessage.users.error_login, responseMessage.users.error_login);
  }
};

const getAllUsers = async (req, res) => {
  try{
    const users = await User.find({});       
    return sendResponse(res, 200, responseMessage.users.get_success, users);    
  }catch(error){    
    errorResponse(res, 500, 'failed server', 'failer server')
  }
};

const createUser = async (req, res)=> {
  const {name, email, password, age, hobbies, department} =req.body;
  try{
    const user = new User({name, email, password, age, hobbies, department});
    await user.save();
    return sendResponse(res, 201, responseMessage.users.create_success, user)
  }catch(error){
  
    errorResponse(res, 500, responseMessage.users.create_failed, error.message);
  }
};

const deleteUserById = async (req, res) => {
  try{
    const {userId} = req.params;
    const result = await User.findByIdAndDelete({_id: userId});
    if (result) {
      console.log(`User with ID ${userId} deleted.`);
    } else {
      console.log(`User with ID ${userId} not found.`);
    }
    sendResponse(res, 202, responseMessage.users.delete_by_id, userId)
  }catch(error){
    errorResponse(res, 500, responseMessage.users.delete_failed, error.message);
  }
};

const updateUserById = async (req, res) => {
  try{
    const {userId} = req.params;
    // const {name, password, email} = req.body;
    const updateUser= await User.findByIdAndUpdate(userId, req.body, {new: true});
    if (updateUser) {
      console.log('User updated', updateUser)
    }else{
      console.log(`User with ID ${userId} not found`);
    }
    sendResponse(res,202, responseMessage.users.update_by_success, updateUser)
  }catch(error){
    errorResponse(res, 500, responseMessage.users.update_by_id, error.message);
  }
  
};


const getUserById = async (req, res) => {
  try{
    const { userId = ""} = req.params;

    const user = await User.findOne({_id: userId});
    const user45 = await User.findOne({_id: userId});
    // const user2 = await Person.find({age: {$gt: 30, $lt:20}});
    // const user3 = await Person.findById(userId);
    // const user4 = await Person.find({age: {$in: [20,45,30]}});
    // const user5 = await Person.find({age: {$gt: 30, $lt: 20}});
    // const users6 = await Person.find({$or: [{name: 'john'}, {age: {$gt: 30}}]});
    const users = await User.find({ hobbies: { $elemMatch: { name: 'Football', level: 'Advanced' } } });

    User.aggregate([
      {
        $group: {
          _id: {age: '$age'},
          totalUser: {$sum: 1},
          average: {$avg: "$age"}
        }
      }
    ]).then(result => {
      console.log(result)
  })
  .catch(error => {
      console.log(error)
  })
    


    console.log(user);
    if (!user) {
      return sendResponse(res, 200, responseMessage.users.failed_userid, user);
    }else {
      return sendResponse(res, 200, responseMessage.users.success_userid, user);
    }
  }catch(error){
    errorResponse(res, 500, responseMessage.users.failed_id, error);
  }
};

const deleteAllUsers = async (req, res) => {
  try{
    const usersToDelete = await User.find({});
    const deleteResult = await User.deleteMany({});
    const result = {
      deletedUsers: usersToDelete,
      deleteCount: deleteResult.deletedCount
    }
    if (result) {
      sendResponse(res, 200, responseMessage.users.success_all_users_deleted, result)
    }else{
      errorResponse(res, 500, responseMessage.users.failed_all_users_deleted,responseMessage.users.failed_all_users_deleted)
    }
  }catch(error){
    errorResponse(res, 500, responseMessage.users.deleteAll_users, error.message)
  }
};

const updatePatchUserById = async (req, res) => {
  const {userId} = req.params;
  const updates = req.body;
  try{   
    const updatedUser = await User.findByIdAndUpdate(userId, {$set: updates}, {new: true});
    if (updatedUser) {
      console.log(updatedUser)
      return sendResponse(res, 202, responseMessage.users.success_patch_updated, updatedUser);      
    }else{
      return errorResponse(res, 404, responseMessage.users.failed_patch_not_found, responseMessage.users.failed_patch_not_found);
    }
  }catch(error){
    errorResponse(res, 500, responseMessage.users.update_by_id, error.message);
  }
  
};

const updatePutUserById = async (req, res) => {
  const {userId} = req.params;
  const updates = req.body;
  try{   
    const updateUser = await User.findByIdAndUpdate(userId, updates, {new: true, overwrite: true});
    if (updateUser) {
      return sendResponse(res, 202, responseMessage.users.success_put_updated, updateUser);
    }else{
      return errorResponse(res, 404, responseMessage.users.failed_put_not_found, responseMessage.users.failed_put_not_found)
    }
  }catch(error){
    errorResponse(res, 500, responseMessage.users.update_by_id, error.message);
  }
  
};

// Store reset tokens (in practice, use a database)
const resetTokens = new Map();


const postForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        error: 'Invalid email format',
        details: 'Please provide a valid email address'
      });
    }

    // Generate and store token (with error handling)
    let resetToken;
    try {
      resetToken = crypto.randomBytes(32).toString('hex');
    } catch (error) {
      console.error('Token generation failed:', error);
      return res.status(500).json({
        error: 'Failed to generate reset token',
        details: 'Internal server error during token generation'
      });
    }

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try {
      await emailService.sendResetEmail(email, resetLink);
      
      // Only store token if email was sent successfully
      resetTokens.set(resetToken, {
        email,
        expiry: Date.now() + 3600000
      });

      res.json({
        message: 'Reset link sent successfully',
        email: email // Return email for confirmation
      });
    } catch (error) {
      let statusCode = 500;
      let errorMessage = 'Failed to send reset email';
      let errorDetails = error.message;

      // Handle specific email errors
      if (error.code === 'EAUTH') {
        statusCode = 503;
        errorMessage = 'Email authentication failed';
        errorDetails = 'Invalid email credentials';
      } else if (error.code === 'ESOCKET') {
        statusCode = 503;
        errorMessage = 'Email service connection failed';
        errorDetails = 'Unable to connect to email service';
      }

      res.status(statusCode).json({
        error: errorMessage,
        details: errorDetails
      });
    }
  } catch (error) {
    console.error('Password reset request failed:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred while processing your request'
    });
  }
};

const postResetPassword = async (req, res) => {
  try{

  }catch(error){

  }
};




module.exports = { getAllUsers, createUser, deleteUserById, updateUserById, getUserById, deleteAllUsers, updatePatchUserById, updatePutUserById, postRegister, login, postForgotPassword, postResetPassword};