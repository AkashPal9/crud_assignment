const express = require("express");
require('dotenv').config();
const mongoose = require("mongoose");
const router = require("./routes/UserRoutes");
const app = express();
app.use(express.json());
app.use(router);
const username = process.env.USER;
const password = process.env.PASSWORD;
const cluster = process.env.DB;

mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/`,
  {
    useNewUrlParser: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// H7HaXd0cTZTj4gwI
