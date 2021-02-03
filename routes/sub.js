const express = require('express')
const router = express.Router();

//middleware import
const {authCheck, adminCheck} = require('../middleware/auth')

//controller import
const { create,remove,update,read,list } = require('../controller/sub')

router.post("/sub",authCheck,adminCheck,create)
router.get("/subs",list)
router.put("/sub/:slug",authCheck,adminCheck,update)
router.get("/sub/:slug",read)
router.delete("/sub/:slug",authCheck,adminCheck,remove)

module.exports = router