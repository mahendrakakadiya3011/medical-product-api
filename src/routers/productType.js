const express = require('express');
const router =new express.Router();
const productType = require('../models/productType');

//create producttype
router.post('/productType', async (req,res) => {
    const ptype = new productType(req.body);

    try{
        await ptype.save();
        res.status(201).send(ptype);
    }
    catch (e) {
        res.status(400).send(e);
    }


    /*ptype.save().then( () => {
        res.status(201).send(ptype);
    }).catch((e) => {
        res.status(400).send(e);
    })*/
})

//get producttype
router.get('/productType',async (req,res) => {

    try{
        const prodtype = await productType.find({});
        res.send(prodtype);
    }
    catch (e) {
        res.status(500).send(e);
    }



    /*productType.find({}).then((prodtype) => {
        res.send(prodtype);
    }).catch((e) => {
        res.status(500).send(e);
    })*/
})

//get product by producttype
/*app.get('/product',(req,res) => {

    product.find({producttype : req.query.producttype}).then((prod) => {
        res.status(201).send(prod);
    }).catch((e) => {
        res.status(500).send(e);
    })
})*/

module.exports = router;