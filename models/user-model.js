const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    age: {type: Number, default: 18},
    salary: {type: Number, default: 10000},
    hobbies: [
        {
            name: {
                type: String,                
            },
            level: {
                type: String,
                enum: ['low','medium','advance'],
                default: 'low'
            }
        }
    ],
    department: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;