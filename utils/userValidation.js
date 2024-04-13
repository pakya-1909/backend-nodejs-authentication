const Joi = require('joi')
const UserModel = require('../models/userModel')
const bcrypt = require('bcrypt')


const userRegisterValidate = (req,res,next)=>{
    const schema = Joi.object({
        name: Joi.string().min(1).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).alphanum().required(),
        role: Joi.string(),
        profile_type: Joi.string(),
        createdAt: Joi.string(),
        updatedAt: Joi.string()
    })

    const {error, value} = schema.validate(req.body)

    if(error){
        return res.status(400).json({success: false, message: error})
    }
    next()
}


const userLoginValidate = (req,res,next)=>{
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).alphanum().required()
    })

    const {error, value} = schema.validate(req.body)

    if(error){
        return res.status(400).json({success: false, message: error})
    }
    next()
}


const isAuthenticate = async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(100),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).alphanum().required(),
        role: Joi.string(),
        profile_type: Joi.string(),
        createdAt: Joi.string(),
        updatedAt: Joi.string()
    })
    
    const {error, value} = schema.validate(req.body)
    if(error){
        return res.status(400).json({success: false, message: error})
    }
    
    const user = await UserModel.findOne({email: req.body.email})
    console.log("is authenticated user", user)
    isMatched = await bcrypt.compare(req.body.password, user.password)
    if(!isMatched) return res.status(401).json({success: false, message: "Unauthorised user"})
    
    next()
}

module.exports = {
    userRegisterValidate,
    userLoginValidate,
    isAuthenticate
}