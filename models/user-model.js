const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: Number,
        enum: [1,2,3,4],
        default: 1
    },
    gender: {
        type: String,
        enum: ['male', 'female','notSpecify'],
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },    
});

/* userSchema.pre('save', async function(next){
    if (!this.isModified('password')) {
        return next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
 */
// Compare password during login
userSchema.methods.matchPassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User