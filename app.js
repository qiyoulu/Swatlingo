const express = require("express");
const request = require("request");

app = express();
const PORT = 3000;

app.get("/home", function (req, res) {
  request("http://127.0.0.1:1234", function (error, response, body) {
    console.error("error:", error); // Print the error
    console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
    console.log("body:", body); // Print the data received
    res.send(body); // Display the response on the website
  });
});

app.listen(PORT, function () {
  console.log("Listening on Port " + PORT);
});

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB =
  "mongodb+srv://swatlingo:rlkG9MCGLgB8mnYi@cluster0.daztqup.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp";

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}
