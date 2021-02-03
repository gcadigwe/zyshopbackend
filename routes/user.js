const express = require('express')

const router = express.Router();

router.post("/user",(req,res)=>{
    res.json({
        data: "Hey you hit user api"
    })
})

module.exports = router