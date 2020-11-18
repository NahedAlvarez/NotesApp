const router = require("express").Router();
const { route } = require(".");
const User = require("../models/User");
//const user = require("../models/User");
const passport = require('passport')


router.get('/users/signin',(req,res) => {
    res.render('users/signin');
})

router.post('/users/signin',passport.authenticate('local',{
successRedirect: '/notes', 
failureRedirect: '/users/signin',
failureFlash: true
}))

router.get('/users/signup',(req,res) => {
    res.render('users/signup');
})

router.post('/users/signup',async(req,res) => {
    const {name,email,password,confirm_password} = req.body;
    const errors = [];
    if(password != confirm_password){
        errors.push({text: 'password do not match'})
    }
    if(name.length <= 0){
        errors.push({text: 'Please Insert Your Name'})
    }
    if(email.length <= 0){
        errors.push({text: 'Please Insert Your Email'})
    }
    if(password.length < 4){
        errors.push({text: 'password must be at least 4 characters'})
    }
    if(errors.length > 0){
        res.render('users/signup',{errors,name,email,password,confirm_password});
    }
    else{
        const emailUser = await User.findOne({email:email})
        if(emailUser){
            req.flash('error_msg','The email is alredy in use')
            res.redirect('/users/signin');
        }
        const newUser = new User({name,email,password});
        newUser.password = await newUser.encryptPassword(password); 
        await newUser.save();
        req.flash('success_msg','You are registered');
        res.redirect('/users/signin');
    }

})

module.exports = router;