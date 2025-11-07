const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    // const cookies = req.cookies;
    // const { token } = cookies;
    // if (!token) {
    //   throw new Error("Invalid token");
    // }
    // console.log(cookies);
    // //validate my token
    // const decodedMessage = await jwt.verify(token, "SoumyaDev@99");
    // const { _id } = decodedMessage;
    // // console.log("Logged in user:" + _id);

    // const user = await User.findById(_id);
    // if (!user) {
    //   throw new Error("User does not exist");
    // }

    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
      // return res.status(400).send("")
    }

    const loggedInUser = req.user;
    // console.log(loggedInUser);

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    // console.log(loggedInUser);

    await loggedInUser.save();

    // res.send(`${loggedInUser.firstName}, your profile updated successfuly`);
    res.json({
      message: `{loggedInUser.firstName}, your prfile updated`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});
module.exports = profileRouter;
