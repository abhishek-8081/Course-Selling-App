const {Router}= require("express");
adminRouter = Router();
const {adminModel,courseModel}= require("../db");
const jwt = require("jsonwebtoken");
const {JWT_ADMIN_PASSWORD}= require("../config");
const { adminMiddleware } = require("../middleware/admin");







adminRouter.post("/signup",async function(req,res){
    const {email,password,firstName,lastName}= req.body;  //To do : Adding ZOD Validation
    //Hash the password so that plain text password is not stores in DB.
   
   
   //Put Try and Catch Block 
    await adminModel.create({
    email:email,
    password:password,
    firstName:firstName,
    lastName:lastName
    })

    res.json({
        message:" Admin Signup Succeeded"
    })

})

adminRouter.post("/signin",async function(req,res){

    const {email,password}=req.body;

    //Todo : Ideally Passsord should be hashed and hec=nce cant complare plain pass with hashed (Bcrypt Library)
    const admin = await adminModel.findOne({
        email:email,
        password:password
    });

    if(admin){
       const token = jwt.sign({
            id:admin._id
        },JWT_ADMIN_PASSWORD);


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

 
adminRouter.post("/course", adminMiddleware,async function(req,res){

    const adminId= req.userId;
    const {title,description,imageUrl,price}=req.body;
    //creating a SAAS in 6 hours by kirat
    const course = await courseModel.create({
        title:title,
        description:description,
        imageUrl:imageUrl,
        price:price,
        creatorId:adminId

    })
    
    res.json({
        message:"cousre created",
        courseId:course._id
    })

})

adminRouter.put("/course",adminMiddleware,async function(req,res){
    const adminId= req.userId;
    const {title,description,imageUrl,price,courseId}=req.body;
    //creating a SAAS in 6 hours by kirat
    const course=await courseModel.updateOne({
        _id:courseId,
        creatorId:adminId
    },{
        title:title,
        description:description,
        imageurl:imageUrl,
        price:price,
        

    })
    
    res.json({
        message:"Course updated ",
        courseId:course._id
    })

 

})

adminRouter.get("/course/bulk",adminMiddleware,async function(req,res){
    const adminId= req.userId;
   
    //creating a SAAS in 6 hours by kirat
    const courses= await courseModel.find({
      
        creatorId:adminId
    });
    
    res.json({
        message: "Course updated",
        courses
    })
    
})

module.exports={
    adminRouter:adminRouter
}