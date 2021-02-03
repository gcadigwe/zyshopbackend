
var admin = require("firebase-admin");

var serviceAccount = require("../fbServiceKey/fbServiceAccountkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://zyshop-a76ea.firebaseio.com"
});

module.exports= admin;