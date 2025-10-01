//ep :04

const express = require("express");
// we have created the server
const app = express();

// order of the routes are very imp.it goes from top to button and
//  if the top one mathces  then it will give the result from the topone.

// app.use("/", (req, res) => {
      //Route Handler
//   res.send("ha haa");
// });

//this will only handle GET call to /user
app.get("/user", (req, res) => {
  res.send({ firstName: "Soumya", lastName: "Roy" });
});

app.post("/user", (req, res) => {
  //saving the data to db
  res.send("Data successfully saved to the database");
});

app.delete("/user", (req, res) => {
  res.send("Delete successfully");
});

// this will match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
  res.send("Hello from the server");
});

// "/test" is a route

app.listen(7777, () => {
  console.log("Server is listeniing to 7777");
});


//ep: 05
