const express = require("express");
// we have created the server
const app = express();

app.use("/user", (req, res) => {
  //Route Handler
  // res.send("Route Handler 1");... it will goes to infinite loop. after sometime after time out it does not return anything
  console.log("Handling router");
});

// "/test" is a route
app.listen(7777, () => {
  console.log("Server is listeniing to 7777");
});

// we cannot send two responses from same url . it will throw error
// we can use multiple route handler

//if we add next() at the last route handler , then it will an error.there is no route handler.

//hw : array of route handler
