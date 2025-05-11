const express=require('express');
const router=express.Router();
const User=require('../models/User')
const { body,validationResult }=require('express-validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
var fetchUser=require('../middleware/fetchUser');
const signUpValidation=require('../middleware/signUpValidation');

const JWT_SECRET=process.env.JWT_SECRET;

router.post('/signUp',signUpValidation,async (req,res)=>{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        let user=await User.findOne({email:req.body.email});
        try{
            if(user){
                return res.status(400).json({error:"Email already exists"});
            }

            const salt=await bcrypt.genSalt(10);
            const safePass=await bcrypt.hash(req.body.password,salt);

            user=await User.create({
                name:req.body.name,
                email:req.body.email,
                password:safePass,
                phone:req.body.phone,
                address:req.body.address,
            });

            const data={
                user:{
                    id:user.id
                }
            }
            const userToken= jwt.sign(data,JWT_SECRET);
            res.json({userToken})
        
        }catch(err){
            res.status(500).send("Something went wrong");
        }
})

router.post('/logIn',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be empty').exists(),
    ],async (req,res)=>{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const{email,password}=req.body;

        try{
            let user=await User.findOne({email});
            if(!user){
                return res.status(400).json({error:"Incorrect email or password"});
            }

            const passwordCompare=await bcrypt.compare(password,user.password);
            if(!passwordCompare){
                return res.status(400).json({error:"Incorrect email or password"});
            }
            else{
                const data={
                    user:{
                        id:user.id
                    }
                }
                const userToken= jwt.sign(data,JWT_SECRET);
                res.json({userToken})
            }
        
        }catch(err){
            res.status(500).send("Something went wrong");
        }
})

router.post('/getUser',fetchUser,async (req,res)=>{
    try{
        userId=req.user.id;
        const user=await User.findById(userId).select("-password");
        res.send(user);
    }
    catch(err){
        res.status(500).send("Something went wrong");
    }
})

module.exports=router