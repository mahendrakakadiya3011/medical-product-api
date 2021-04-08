const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router =new express.Router();

//create user
router.post('/users', async (req,res) => {
    const user = new User(req.body);
    
     User.findOne({email: user.email}).then(async(user1)=>{
        if(user1){
            return res.status(400).send('user aleready registered');
        }
        await user.save();
        const token = await user.generateAuthToken();
        return res.status(201).send({user,token});
    }).catch(e=>{ 
        return res.status(400).send(e);
    })
    /*user.save().then( () => {
        res.status(201).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })*/
})

//login user
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user,token})
        
    } catch (e) {
        res.status(400).send()
    }
})

//user logout
router.post('/users/logout',auth,async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save();
        res.send();
    }
    catch (e) {
        res.status(500).send();
    }
})

//get  user
router.get('/users/me' ,auth, async (req,res) => {
    res.send(req.user);
})

//update user
router.patch('/users/me',auth,async (req,res) => {
    const updates = Object.keys(req.body);
    const allowupdates = ['name','email','password','age'];
    const isvalidoperation = updates.every((update) => allowupdates.includes(update));
    if(!isvalidoperation)
    {
        return res.status(404).send({error : 'Invalid operation'});
    }
    try{
        //const user = await User.findById(req.params.id);
        updates.forEach((update) => {
           req.user[update] = req.body[update];
        })

        await req.user.save(); 
        
       // const user = await User.findByIdAndUpdate(req.params.id,req.body,{new : true, runValidators : true})
            
        res.send(req.user);
    }
    catch (e) {
        res.status(400).send(e);
    }
    
})

//delete user
router.delete('/users/me',auth,async (req,res) => {
    try{
        await req.user.remove();
        res.send(req.user);
    }
    catch (e) {
        res.status(500).send(e);
    }
})


module.exports = router;