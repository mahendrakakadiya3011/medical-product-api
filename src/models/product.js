const mongoose = require('mongoose');
const producttype = require('./productType')

const productSchema = new mongoose.Schema({
    producttype: {
        type: String,
        required: true,
        trim: true,
        //ref: 'productType'
    },
    productname: {
        type: String,
        minLength: 3,
        required: true,
        trim: true
    },
    expirydate:{
        type: Date,
        required:true
    },
    price: {
        type: Number,
        default:0
    },
    likes:{
        type:Number,
        default:0
    },
    comment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment'
        }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    }
},{
    timestamps : true
})
productSchema.pre('save', async function (next) {
    const product = this
    
    const typename = await producttype.findOne({ producttype: product.producttype })
    if (typename) {
        next()
    } else {
        const newtype = new producttype({
            producttype: product.producttype,
            owner: product.owner
        })
        await newtype.save()
        next()
    }
})

const product = mongoose.model('product' , productSchema);

module.exports = product;