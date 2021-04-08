const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    content: { 
        type: String, 
        required: true 
    },
    by : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    for : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'product'
    }
},{ 
    timestamps: true
});
const comment = mongoose.model('comment' ,commentSchema );

module.exports = comment;