const express = require('express');
const router = express.Router();
const {User} = require('../models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) => {
    let userList = await User.find().select('-passwordHash');

    if (!userList) {
        res.status(500).json({success:false})
    }
    res.send(userList);
})


router.post(`/`, async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 13),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        street: req.body.street,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    }) 

    user = await user.save();

   if (!user) {
        return res.status(404).send('the user cannot be created')
   }

   res.send(user);
})

router.post(`/register`, async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 13),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        street: req.body.street,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    }) 

    user = await user.save();

   if (!user) {
        return res.status(404).send('the user cannot be created')
   }

   res.send(user);
})

router.get('/:id', async (req, res) =>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user) {
        return res.status(500).json({success:false, message: 'The user with given ID was not found'});
    }

    return res.status(200).json({user})
})


router.delete('/:id', (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user=>{
        if (user) {
            return res.status(200).json({success:true, message: 'the user is deleted!'})
        } else{
            return res.status(404).json({success:false, message:'user not found!'})
        }
    }).catch(err=>{
        return res.status(400).json({success:true, error:err})
    })
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    const secret = process.env.secret;

    if (!user) {
        return res.status(404).send('User not found')
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn: '1d'}
        )
        res.status(200).send({user: user.email, token: token});
    }else{
        return res.status(400).send('password is wrong')
    }

    return res.status(200).send(user);
})


router.get('/get/count', async (req, res) =>{
    let UserCount = await User.countDocuments();

    if (!UserCount) {
        return res.status(500).json({success:false, message: 'The UserCount  was not found'});
    }

    return res.status(200).json({UserCount: UserCount})
})


module.exports= router;
