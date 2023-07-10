require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://himanshu:"+process.env.PASSWORD+"@cluster0.ldhhkav.mongodb.net/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
  });

userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields:["password"]});
  
const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
     res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", async function(req, res){
     try{
        const newUser = new User({
        email: req.body.username,
        password: req.body.password
        });
        newUser.save();
        res.render("secrets");
     }
     catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      }
});

app.post("/login", async function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    try{
      const foundUser = await User.findOne({email: username});
      if(foundUser.password === password)
      res.render("secrets");
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      }
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
  });

