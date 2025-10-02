const express = require("express");
// we have created the server
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

//signup api
app.post("/signup", async (req, res) => {
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

//login api
app.post("/login", async (req, res) => {
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
      res.send("Login Successful");
    } else {
      throw new Error("Password not correct");
    }
  } catch (error) {
    res.status(400).send("Error :" + error.message);
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
app.patch("/user/:userId", async (req, res) => {
  const data = req.body;
  // const userId = req.body.userId;
  const userId = req.params?.userId;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10 ");
    }

    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    // runValidators is used to run the validation in the existing data
    res.send("user updated successfully");
  } catch (error) {
    res.status(400).send("Update failed:" + error.message);
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
