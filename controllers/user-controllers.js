const { Person } = require('../models/person-model');
const User = require('../models/user-model');
const { sendResponse, errorResponse } = require('../utils/response');
const responseMessage = require("../utils/responseMessage");

const getAllUsers = async (req, res) => {
  try{
    const users = await User.find({});
    User.aggregate([
      {
          $group:
          {
              _id: { age: "$age", district: "$district"},
              totalUser: { $sum: 1 },
              averageAge: { $avg: "$age" }
          }
      }
  ])
      .then(result => {
          console.log(result)
      })
      .catch(error => {
          console.log(error)
      })
    sendResponse(res, 200, responseMessage.users.get_success, users);    
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


module.exports = { getAllUsers, createUser, deleteUserById, updateUserById, getUserById, deleteAllUsers, updatePatchUserById, updatePutUserById};