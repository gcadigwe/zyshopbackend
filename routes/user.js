const express = require('express')

const router = express.Router();

//import midlleware
const {authCheck} = require('../middleware/auth')

//import controllers

const {saveCart,getCart,removecart,saveaddress} = require('../controller/cart')


router.post('/user/cart',authCheck,saveCart)
router.get('/getcart',authCheck,getCart)
router.delete("/user/cart",authCheck,removecart)
router.post("/user/saveaddress",authCheck,saveaddress)

module.exports = router