const express = require('express')
const router = express.Router();

//middleware import
const {authCheck, adminCheck} = require('../middleware/auth')

//controller import
const { create,listAll,remove,read,update,list,count,productStar,listRelatedProduct,filterSearch } = require('../controller/product')

router.post("/product",authCheck,adminCheck,create)
router.get("/product/count",count)
router.get("/products/:count",listAll)
router.delete("/product/delete/:slug", authCheck,adminCheck,remove)
router.get("/product/:slug",read)
router.put("/product/:slug",authCheck,adminCheck,update)
router.put("/product/star/:productId",authCheck,productStar)
router.get("/product/related/:productId",listRelatedProduct)
router.post("/products",list)
router.post("/search/filter",filterSearch)

module.exports = router