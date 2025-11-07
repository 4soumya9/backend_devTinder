const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    //Validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    // Creating a new instance of the User model
    // const user = new User(req.body);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User Added successfully");
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    // wrtie a check for email id validation...homework
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials(email)");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // this compare method will compare the password and encrypted password stored in the database.
    //  Previously we stored password in encrypted mode

    // console.log(user.password);
    if (isPasswordValid) {
      //create a JWT Token
      const token = await jwt.sign({ _id: user.id }, "SoumyaDev@99");
      //Add the token to cookie and send the response back to the user
      res.cookie("token", token);
      res.send("Login Successful");
    } else {
      throw new Error("Password not correct");
    }
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("logout successful");
});
module.exports = authRouter;
