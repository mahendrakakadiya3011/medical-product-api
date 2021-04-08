const mongoose = require('mongoose');

const producttypeSchema = new mongoose.Schema({
    producttype : {
        type: 'string',
        minLength: 2,
        required: true,
        unique: true
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
},{
    timestamps: true
})

const productType = mongoose.model('productType' , producttypeSchema)

module.exports = productType;