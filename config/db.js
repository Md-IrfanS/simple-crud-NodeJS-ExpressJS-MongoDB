const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    const MONGOURI = process.env.MONGOURI
    try {
        mongoose.connect(MONGOURI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        }).then(() => {
            console.log("MongoDB connected successfully")
        }).catch(() => {
            console.log("connection failed")
        })
    } catch (error) {
        console.log("error in connecting DB", error)
    }
}

module.exports = connectDB