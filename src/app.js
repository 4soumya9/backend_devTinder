const express = require("express");
// we have created the server
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Virat",
    lastName: "Roy",
    emailId: "abccc@gmail.com",
    password: "a1bc@gmail.com",
  });

  //await user.save(); //this will give the promise, usually all the apis are returning a promise
  //res.send("user added successfully");
  // // i am creating a new instance of the user model
  // const user = new User(userObj);.. method 2

  try {
    await user.save();
    res.send("User Added successfully");
  } catch (error) {
    res.status(400).send("Error saving the user:" + error.message);
  }
});
// first we connect to the database then start the server
connectDB()
  .then(() => {
    console.log("Database connection established..");
    app.listen(7777, () => {
      console.log("Server is listeniing to 7777");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });

// "/test" is a route
