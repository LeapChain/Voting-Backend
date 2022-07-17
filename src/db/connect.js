const mongoose = require("mongoose");

var MONGO_DB_URI = process.env.MONGO_URI;

if (process.env.NODE_ENV == "development") {
  MONGO_DB_URI = "mongodb://leapcoin:leapcoin@mongo:27017/?authSource=admin";
}

mongoose
  .connect(MONGO_DB_URI)
  .then(() => {
    console.log("Connected to db successfully");
  })
  .catch((error) => {
    console.log(error);
  });
