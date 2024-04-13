const express = require('express')
const { registerUser, loginUser, userUpdate, getUser } = require('../userController')
const { userRegisterValidate, userLoginValidate, isAuthenticate } = require('../utils/userValidation')
const routes = express.Router()


routes.post('/register', userRegisterValidate ,registerUser)
routes.post('/login', userLoginValidate ,loginUser)
routes.patch('/user', isAuthenticate , userUpdate)
routes.get('/user', isAuthenticate , getUser)


module.exports = routes   