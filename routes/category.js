const express = require('express')
const router = express.Router();

//middleware import
const {authCheck, adminCheck} = require('../middleware/auth')

//controller import
const { create,remove,update,read,list,getSubs } = require('../controller/category')

router.post("/category",authCheck,adminCheck,create)
router.get("/categories",list)
router.put("/category/:slug",authCheck,adminCheck,update)
router.get("/category/:slug",read)
router.delete("/category/:slug",authCheck,adminCheck,remove)
router.get("/category/subs/:_id",getSubs)

module.exports = router