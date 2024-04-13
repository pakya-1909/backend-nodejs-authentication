const mongoose = require('mongoose')

const url = process.env.MONGO_DB_URL

mongoose.connect(url).then(()=>{
    console.log("mongoDB connected")
}).catch((err)=>{
    console.log("error: ", err)
})