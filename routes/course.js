const {Router}= require("express");
courseRouter = Router();
const {courseModel,purchaseModel}= require("../db");
const {userMiddleware}=require("../middleware/user");


courseRouter.post("/purchase",userMiddleware,async function(req,res){
    const userId = req.userId;
    const courseId= req.body.courseId;

    // Check here if user have actually paid the price or not 

    await purchaseModel.create({
        userId,
        courseId


    })

    res.json({
        message:"You have successfully bought the course "
    })

})

courseRouter.get("/preview",async function(req,res){
    const courses= await courseModel.find({});
    res.json({
        courses
    })

})

module.exports={
    courseRouter:courseRouter
}