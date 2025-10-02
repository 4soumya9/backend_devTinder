const express = require("express");
// we have created the server
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  // console.log(req.body);
  // Creating a new instance of the User model
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User Added successfully");
  } catch (error) {
    res.status(400).send("Error saving the user:" + error.message);
  }
});

//get user by email only one user
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.findOne({ emailId: userEmail }); // findOne gives the oldest document

    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//Feed API- GET/feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//delete a user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    // const user = await User.findByIdAndDelete({ _id: userId });
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//update a user
app.patch("/user", async (req, res) => {
  const data = req.body;
  const userId = req.body.userId;
  try {
    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    // runValidators is used to run the validation in the existing data
    res.send("user updated successfully");
  } catch (error) {
    res.status(400).send("Update failed:"+ error.message);
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
