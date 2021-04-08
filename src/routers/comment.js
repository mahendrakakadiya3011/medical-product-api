const express = require('express');
const router = new express.Router();
const Comment = require('../models/comment');
const product = require('../models/product');
const auth = require('../middleware/auth');



//create comment
router.post('/comment/:productid', auth,async (req,res) => {
    const comment = new Comment({
        ...req.body,
        by : req.user._id,
        for : req.params.productid
    });

    try{
        await comment.save();
        product.findById(req.params.productid).then(async product=>{
            product.comment =product.comment.concat(comment)
        product.save();

        return res.status(201).send(comment); 
    })
    }
    catch (e){
        res.status(400).send(e);
    }
})


module.exports = router;
