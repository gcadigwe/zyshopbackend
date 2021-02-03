const admin = require('../firebase/index')
const User = require('../models/user')

exports.authCheck = async (req,res,next) => {
    try {
        const firebaseuser = await admin.auth().verifyIdToken(req.headers.authtoken)
        req.user = firebaseuser
        next();
    } catch (err) {
        res.status(401).json({
            err: "Invalid or expired token"
        })
    }
}

exports.adminCheck = async (req,res,next) => {
   const {email} = req.user
  const user = await User.findOne({email}).exec()
  if(user.role !== "admin"){
      res.status(403).json({
          err: "Admin resources. Access denied"
      })
  }else{
    next();
}



}