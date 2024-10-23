const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,        
    },
    author: {
        type: String,
    },
    comments: [
        {
            body: {
                type: String,                
            },
            date: {
                type: Date
            }
        }
    ],    
});

const Blog = mongoose.model('blog', blogSchema);
module.exports = Blog;
