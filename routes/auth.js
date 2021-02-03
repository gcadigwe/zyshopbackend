const express = require('express')
const router = express.Router();

//middleware import
const {authCheck, adminCheck} = require('../middleware/auth')

//controller import
const { creatOrupdate, currentuser } = require('../controller/auth')

router.post("/create-or-update",authCheck, creatOrupdate)
router.post("/currentuser",authCheck, currentuser)
router.post("/current-admin",authCheck,adminCheck, currentuser)

module.exports = router