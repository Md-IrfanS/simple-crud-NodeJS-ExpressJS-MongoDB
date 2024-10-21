const express =require('express');
const { getAllUsers, createUser, deleteUserById, updateUserById, getUserById, deleteAllUsers, updatePatchUserById, updatePutUserById} = require('../controllers/user-controllers');

const userRoutes = express.Router();

userRoutes.get("/", getAllUsers);
userRoutes.post("/create-user", createUser);
userRoutes.delete('/delete-user/:userId', deleteUserById);
userRoutes.post('/update-user/:userId',updateUserById);
userRoutes.patch('/update-user/:userId', updatePatchUserById);
userRoutes.put('/update-user/:userId', updatePutUserById);
userRoutes.get('/:userId', getUserById);
userRoutes.delete('/delete-all-users', deleteAllUsers);


module.exports = {userRoutes};