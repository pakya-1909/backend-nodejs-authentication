const UserModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = { 

    registerUser: async (req,res)=>{
        const userModel = new UserModel(req.body)
        userModel.password = await bcrypt.hash(req.body.password, 10)

        try{
            const response = await userModel.save()
            response.password = undefined
            res.status(201).json({success: true, message: response})

        }catch(error){
            res.status(500).json({success: false, message: error})
        }
    },

    loginUser: async (req,res)=>{
        try {
            const user = await UserModel.findOne({email: req.body.email})
            if(!user) return res.status(401).json({success: false, message: "User not found"})

            isMatched = await bcrypt.compare(req.body.password, user.password)
            if(!isMatched) return res.status(401).json({success: false, message: "Unauthorised user"})

            
            const tockenObject = {
                _id: user._id,
                email: user.email,
                password: user.password
            }

            const jwtToken = jwt.sign(tockenObject, process.env.SECRET, {expiresIn: '4h'})

            return res.status(200).json({success: true, token: jwtToken, message: user})

        } catch (error) {
            return res.status(500).json({success: false, message: error})
        }
    },
    userUpdate: async (req,res)=>{
        try {
            const user = await UserModel.findOne({email: req.body.email})
            if(!user) return res.status(401).json({success: false, message: "User not found"})

            isMatched = await bcrypt.compare(req.body.password, user.password)

            if(!isMatched){
                user.password = await bcrypt.hash(req.body.new_password, 10)

                const updateFields = {
                    name: req.body.name,
                    email: req.body.email,
                    password: user.password,
                    role: req.body.role,
                    profile_type: req.body.profile_type,
                }

                await UserModel.findByIdAndUpdate({_id: user?._id}, updateFields)
            }else{
                const updateFields = {
                    name: req.body.name,
                    email: req.body.email,
                    role: req.body.role,
                    profile_type: req.body.profile_type,
                }

                await UserModel.findByIdAndUpdate({_id: user?._id}, updateFields)
            }

            return res.status(202).json({success: true, message: "fields updated successfully"})

        } catch (error) {
            return res.status(500).json({success: false, message: error})
        }
    },
    getUser: async (req,res)=>{
        try {
            const user = await UserModel.findOne({email: req.body.email})
            if(!user) return res.status(401).json({success: false, message: "User not found"})

            console.log('get user ==>', user)

            isMatched = await bcrypt.compare(req.body.password, user.password)
            if(!isMatched) return res.status(401).json({success: false, message: "Unauthorised user"})

            console.log("is matched ==>", isMatched)

            isAdmin = user?.role === 'admin' ? true : false

            console.log("is admin ==>", isAdmin)

            if(isAdmin){
                const allUsers = await UserModel.find({})
                console.log("all users ==>", allUsers)
                return res.status(200).json({success: true, message: allUsers})
            }else{
                const publicUsers = await UserModel.find({profile_type: 'public'})
                console.log("public users ==>", publicUsers)
                return res.status(200).json({success: true, message: publicUsers})
            }
        } catch (error) {
            return res.status(500).json({success: false, message: error})
        }
    }
}


// $2b$10$pWhZ5C/FVBnpgvfSNEh9p..CxizAxbPxyNkME8aWajtfkwZy0N1rW