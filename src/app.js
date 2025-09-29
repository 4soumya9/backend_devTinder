const express = require("express");
// we have created the server
const app = express();

app.use("", (req, res) => {
  res.send("From root Soumya Saha");
});
app.use("/hello", (req, res) => {
  res.send("hello hello");
});
app.use("/test", (req, res) => {
  res.send("Hello from the server");
});

// "/test" is a route

app.listen(7777, () => {
  console.log("Server is listeniing to 7777");
});
