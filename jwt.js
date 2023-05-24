require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_KEY; 
const User=require("./modal/User");

// JWT utility functions
const generateToken = (payload) => {
    return jwt.sign(payload, secretKey, { expiresIn: '1d' });
  };
  
  

  // Authentication middleware
  const authenticateToken = async (req, res, next) => {
    console.log("AUTH: USER AUTH MIDDLEWARE CALLED");
    try {
      if (!req.headers.authorization)
       return res.send("Token not found in header!", "notFound");
  
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, secretKey);
  
      let userData = await User.findOne({_id:decoded.userId});
      userData = JSON.parse(JSON.stringify(userData));
    // console.log(userData,"userdata")
    //   if (!userData) return res.send("Token expired!", "unAuthorized");
  
      req.userData = userData; 
      next();
    } catch (error) {
      console.error(error);
  
      return next(error);
    }
  };
  

module.exports={
    authenticateToken,
    generateToken
}