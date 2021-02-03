const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParse = require('body-parser')
const cors = require('cors')
const fs = require("fs")
require('dotenv').config()


//app
const app = express()

//mongodb connect

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true,useFindAndModify: false })
    .then(() => console.log("DB Connected"));

mongoose.connection.on("error", err => {
    console.log(`DB connection error: ${err.message}`);
});

//middlewares
app.use(morgan("dev"))
app.use(bodyParse.json({limit: "2mb"}))
app.use(cors());

//autoloading routes
fs.readdirSync("./routes").map((r)=>{
    app.use("/api", require("./routes/"+r))
})

//connecting port

const port = process.env.PORT || 8000

app.listen(port,()=>{
    console.log(`App is running on port ${port}`)
})