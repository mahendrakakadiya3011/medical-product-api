const express = require('express');
const product = require('../models/product');
const auth = require('../middleware/auth');
const router =new express.Router();

//create product
router.post('/product', auth, async (req,res) => { 
    const Product = new product({
        ...req.body,
        owner: req.user._id
    })
    try{
        await Product.save();
        res.status(201).send(Product);
    }
    catch (e) {
        res.status(400).send(e)
    }
})

//get all product
router.get('/product',auth,async (req,res) => {

    try{
        const prod = await product.find({}).populate('comment');
        res.send(prod);
    }
    catch (e) {
        res.status(500).send(e);
    }
})


//get product by type
//GET /products?producttype=syrup
router.get('/products',auth,async (req, res) => {
    try {
        const prod = await product.find({ producttype: req.query.producttype }).populate('comment');
        if(!prod){
            return res.send('there is no any kind of product of that type');
        }
        res.send(prod);

    } catch (e) {
        res.status(500).send()
    }
})

//get most recent product
router.get('/productsa', auth, async (req, res) => {
    try {
        const mysort = {createdAt : 1}
        await product.find().populate('comment').sort(mysort).exec(function (err,prod){
            if(err)
            {
                return res.send(e);
            }
            res.send(prod)
        });

    } catch (e) {
        res.status(500).send()
    }
})

//like or dislike product
router.post("/products/:id", auth, async (req, res) => {
    
    try {
        if(req.query.like === 'true'){
            await product.findOneAndUpdate({_id:req.params.id},{$inc:{likes:1}},{'new':true})
            res.send('Liked the product')
            //console.log(req.query.like)
        }
        else if(req.query.like === 'false'){
            await product.findOneAndUpdate({_id:req.params.id},{$inc :{likes:-1}},{'new':true})
            res.send('Disliked the product')
            //console.log(req.query.like)
        }
        else{
            res.send('please like or dislike the product')
        }

    } catch (e) {
        res.status(400).send(e)
    }

});

//get most liked product
router.get('/mostlikedproduct', auth, async (req, res) => {
    try {
        const mysort = {likes : -1}
        await product.find().populate('comment').sort(mysort).exec(function (err,prod){
            if(err)
            {
                return res.send(e);
            }
            res.send(prod)
        });

    } catch (e) {
        res.status(500).send()
    }
})


//update product
router.patch('/product/:id',auth,async (req,res) => {
    const updates = Object.keys(req.body);
    const allowupdates = ['producttype','productname','price'];
    const isvalidoperation = updates.every((update) => allowupdates.includes(update));
    if(!isvalidoperation)
    {
        return res.status(404).send(' you can updates only producttype,productname and price');
    }
    try{
        //const Product = await product.findById(req.params.id);
        const Product = await product.findOne({_id : req.params.id,owner : req.user._id}).populate('comment')
        if(!Product)
        {
            return res.status(404).send();
        }

        updates.forEach((update) => {
            Product[update] = req.body[update];
         })
 
        await Product.save();

        //const Product = await product.findByIdAndUpdate(req.params.id,req.body,{new : true, runValidators : true})
        
        res.send(Product);
    }
    catch (e) {
        res.status(400).send(e);
    }
    
})

//delete product
router.delete('/product/:id',auth,async (req,res) => {
    try{
        const Product = await product.findOneAndDelete({_id : req.params.id,owner : req.user._id}).populate('comment')
        //const Product = await product.findByIdAndDelete(req.params.id);

        if(!Product)
        {
            return res.status(404).send();
        }
        res.send(Product);
    }
    catch (e) {
        res.status(500).send(e);
    }
})

module.exports = router;