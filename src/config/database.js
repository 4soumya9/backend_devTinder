const mongoose = require("mongooses");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namsteDev:3OKq2qiUbv5engah@namastenode.x7opnqu.mongodb.net/HelloWorld"
  );
};

module.exports = connectDB;

connectDB()
  .then(() => {
    console.log("Database connection established..");
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
