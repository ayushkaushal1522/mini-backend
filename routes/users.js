const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt")

// update the user
router.put("/:id",async (req,res)=>{
    // console.log("suno mere baat bhai logon")
    if(req.body.userId === req.params.id || req.body.isAdmin){
        console.log("suno mere baat bhai logon chal ja yaar")
        // if(req.body.password){
        //     try{
        //         const salt = await bcrypt.genSalt(10);
        //         req.body.password = await bcrypt.hash(req.body.password , salt);
        //     }
        //     catch(error){
        //         return res.status(500).json(error);
        //     }
        // }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set :req.body,
            });
            res.status(200).json("Accout has been Updated successfully");
            console.log("Accout has been Updated successfully")
            console.log(req.body);
        }
        catch(error){
            return res.status(500).json(error);
        }
    }
    else{
        return res.status(403).json("You can update only your account");
    }
})

//delete user
router.put("/:id/delete",async (req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        
        try{
            // console.log("aaya");
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Accout has been deleted successfully");
            // console.log("delete hua");
        }
        catch(error){
            return res.status(500).json(error);
        }
    }
    else{
        return res.status(403).json("You can delete only your account");
    }
});


// get all friends
router.get("/friends/:userId", async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      const friends = await Promise.all(
        user.followings.map((friendId) => {
          return User.findById(friendId);
        })
      );
      let friendList = [];
      friends.map((friend) => {
        const { _id, username, profilePicture } = friend;
        friendList.push({ _id, username, profilePicture });
      });
      res.status(200).json(friendList)
    } catch (err) {
      res.status(500).json(err);
    }
  });

// get a user
router.get("/" , async (req,res)=>{
    const userId = req.query.userId;
    const username = req.query.username;
    console.log("hii" + username);


    try
    {
    const user = userId 
    ? await User.findById(userId) 
    : await User.findOne({username:username});
    const {password , updatedAt , ...other} = user._doc
    res.status(200).json(other);
    console.log(other)
    }
    catch(error){
        res.status(500).json(error);
    }
})

// follow a user
router.put("/:id/follow",async (req,res)=>{
    if(req.body.usersId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentuser = await User.findById(req.body.usersId);
            if(!user.followers.includes(req.body.usersId)){
                await user.updateOne({$push:{followers : req.body.usersId}});
                await currentuser.updateOne({$push:{followings : req.params.id}});
                res.status(200).json("user has been followed");
            }
            else{
                res.status(403).json("You are already following this user")
            }

        }
        catch(error){
            res.status(500).json(error);
        }
    }
    else{
        res.status(403).json("You cannot follow yourself");
    }
})

//unfollow aa user
router.put("/:id/unfollow",async (req,res)=>{
    if(req.body.usersId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentuser = await User.findById(req.body.usersId);
            if(user.followers.includes(req.body.usersId)){
                await user.updateOne({$pull:{followers : req.body.usersId}});
                await currentuser.updateOne({$pull:{followings : req.params.id}});
                res.status(200).json("user has been unfollowed");
            }
            else{
                res.status(403).json("You dont follow this user")
            }

        }
        catch(error){
            res.status(500).json(error);
        }
    }
    else{
        res.status(403).json("You cannot unfollow yourself");
    }
})

//all users listing 
router.get("/allusers", async (req, res) => {
    try {
      const users = await User.find();
    //   console.log(user);
      let usersList = [];
      users.map((user) => {
        const { _id, username, profilePicture } = user;
        usersList.push({ _id, username, profilePicture });
      });
      res.status(200).json(usersList)
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports =  router
