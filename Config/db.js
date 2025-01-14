const mongoose = require("mongoose");

const uri ="mongodb+srv://kashishsingh124356:mern%40123@cluster0.qloxo.mongodb.net/"

function connectDb() {
  mongoose
    .connect(uri)
    .then(() => console.log("Connected to the MongoDB database"))
    .catch((err) => console.log("Connection error", err));
}

module.exports = connectDb;