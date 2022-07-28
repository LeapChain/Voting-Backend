const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to db successfully");
  })
  .catch((error) => {
    console.log(error);
  });
