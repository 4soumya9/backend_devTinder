const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    //Read the token from the req cookies
    //Validate the token
    //Find the user
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not vallid");
    }
    const decodedObj = await jwt.verify(token, "SoumyaDev@99");
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next(); // next handler
  } catch (error) {
    res.status(400).send("ERROR: from auth " + error.message);
  }
};

module.exports = {
  userAuth,
};
