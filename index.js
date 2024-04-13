const express = require("express")
const app = express()
const routes = require("./routes")
const bodyParser = require("body-parser")
const PORT = process.env.PORT || 8080

require('dotenv').config()
require('./config/db')

app.use(bodyParser.json())
app.use('/api/v1', routes)

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT: ${PORT}`)
})