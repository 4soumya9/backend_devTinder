app.use("/user", (req, res) => {
//Route Handler
// res.send("Route Handler 1");... it will goes to infinite loop. after sometime after time out it does not return anything
console.log("Handling router");
});

// we cannot send two responses from same url . it will throw error
// we can use multiple route handler

//if we add next() at the last route handler , then it will an error.there is no route handler.

//hw : array of route handler

Schema

///ep-7
const express = require("express");
// we have created the server
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
console.log(req.body);
// Creating a new instance of the User model
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

// app.js until 10 th
const express = require("express");
// we have created the server
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

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

//profile
app.get("/profile", userAuth, async (req, res) => {
try {
// const cookies = req.cookies;
// const { token } = cookies;
// if (!token) {
// throw new Error("Invalid token");
// }
// console.log(cookies);
// //validate my token
// const decodedMessage = await jwt.verify(token, "SoumyaDev@99");
// const { \_id } = decodedMessage;
// // console.log("Logged in user:" + \_id);

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
// const user = await User.findByIdAndDelete({ \_id: userId });
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
