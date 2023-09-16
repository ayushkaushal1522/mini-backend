const router = require("express").Router();
const { response } = require("express");
const User = require("../models/User")
const bcrypt = require("bcrypt")
// register
router.post("/register", async (req,res)=>{
   

   try{

      //generating hashed password
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(req.body.password , salt);


      const newuser =  new User({
         username:req.body.username,
         email:req.body.email,
         password:hashedpassword
      });
      // saving the user and returning the response
      const user = await newuser.save();
      console.log(user);
      res.status(200).json(user);
      

   }
   catch(error){
      res.status(500).json(error);
   }
})


//login royte

router.post("/login",async (req,res)=>{
   try{
      const user = await User.findOne({email:req.body.email});
      !user && res.status(404).json("User Not Found");
      const validpassword = await bcrypt.compare(req.body.password,user.password);
      !validpassword && res.status(400).json("wrong pasword");

      res.status(200).json(user);
   }
   catch(error){
      res.status(500).json(error);
   }
   
})
module.exports =  router
