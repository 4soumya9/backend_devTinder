const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namsteDev:3OKq2qiUbv5engah@namastenode.x7opnqu.mongodb.net/devTinder"
  );
};

module.exports = connectDB;

