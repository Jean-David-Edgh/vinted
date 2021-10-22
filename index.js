require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

mongoose.connect(process.env.MONGO_DB_URI);

console.log("TEST TEST");
console.log("TEST TEST");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cors());
app.use(formidable());

app.get("/", (req, res) => {
  res.json("WELCOME TO MY VINTED API ! 😎");
});

const userRoutes = require("./routes/users");
app.use(userRoutes);
const offerRoutes = require("./routes/offers");
app.use(offerRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
