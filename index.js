require("dotenv").config();
const express = require("express");
// for mongoose database
const mongoose = require("mongoose");

//Initialising express
const shapeAI = express();

// Microservices Routes
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");
// Configurations express
shapeAI.use(express.json());

// Established Database connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("connection Established to Mongodb Database"));

//Initialising Microservices
shapeAI.use("/book", Books);
shapeAI.use("/author", Authors);
shapeAI.use("/publication", Publications);
// For Server start
shapeAI.listen(3000, () => console.log("Server is start"));
