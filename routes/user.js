const {Router} = require("express");
const userRouter = Router();
const {userModel, purchaseModel,courseModel}= require("../db");
const jwt = require("jsonwebtoken");
const {JWT_USER_PASSWORD}= require("../config");
const { userMiddleware } = require("../middleware/user");



userRouter.post("/signup",async function(req,res){
    const {email,password,firstName,lastName}= req.body;  //To do : Adding ZOD Validation
    //Hash the password so that plain text password is not stores in DB.
   
   
   //Put Try and Catch Block 
    await userModel.create({
    email:email,
    password:password,
    firstName:firstName,
    lastName:lastName

})
    res.json({
        message:"Signup Suceeded"
    })

})

userRouter.post("/signin",async function(req,res){
    const {email,password}=req.body;

    //Todo : Ideally Passsord should be hashed and hec=nce cant complare plain pass with hashed (Bcrypt Library)
    const user = await userModel.findOne({
        email:email,
        password:password
    });

    if(user){
       const token =  jwt.sign({
            id:user._id
        },JWT_USER_PASSWORD);


        // DO Cookie logic if wish

        res.json({
            token:token
        })

    }
    else{
        res.status(403).json({
            message:"Incorrect Credentials"
        })
    }
    
})

userRouter.get("/purchases", userMiddleware, async function(req, res) {
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    });

    let purchasedCourseIds = [];

    for (let i = 0; i<purchases.length;i++){ 
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })

    res.json({
        purchases,
        coursesData
    })
})

module.exports={
    userRouter:userRouter
}