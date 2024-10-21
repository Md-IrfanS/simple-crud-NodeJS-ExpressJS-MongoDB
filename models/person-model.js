const mongoose = require('mongoose');
const storeSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "person"
    },
    title: String,
    fans: [{type: mongoose.Schema.Types.ObjectId, ref: 'person'}]
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,        
    },
    age: {
        type: String,        
    },
    stories: [{type: mongoose.Schema.Types.ObjectId, ref: 'story'}]
});

const Person = mongoose.model('person', personSchema);
const Story = mongoose.model('story', storeSchema);
module.exports = {Person, Story}