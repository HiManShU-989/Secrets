require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
<<<<<<< HEAD
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

=======
const encrypt = require("mongoose-encryption");
>>>>>>> origin/main

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

<<<<<<< HEAD
app.use(session({
  secret: "Secrets you can't guess on your own.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

=======
>>>>>>> origin/main
mongoose.connect("mongodb+srv://himanshu:"+process.env.PASSWORD+"@cluster0.ldhhkav.mongodb.net/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    email: String,
<<<<<<< HEAD
    password: String,
    googleId: String,
    secret: String
  });

  userSchema.plugin(passportLocalMongoose);
  userSchema.plugin(findOrCreate);
  
const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ _id: id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

=======
    password: String
  });

userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields:["password"]});
  
const User = mongoose.model("User", userSchema);

>>>>>>> origin/main
app.get("/", function(req, res){
     res.render("home");
});

<<<<<<< HEAD
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] }));

  app.get("/auth/google/secrets", 
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect("/secrets");
  });

=======
>>>>>>> origin/main
app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

<<<<<<< HEAD
app.get("/secrets", async function(req, res){
    try{
      const foundUsers = await User.find({"secret":{$ne: null}});
      res.render("secrets", {usersWithSecrets: foundUsers});
    }
    catch(err){
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
});

app.get("/submit", function(req, res){
  if(req.isAuthenticated()){
    res.render("submit");
  }
  else{
    res.redirect("/login");
  }
});

app.post("/submit", async function(req, res){
    const submittedSecret = req.body.secret;
    try{
      const foundUser = await User.findById(req.user.id);
      foundUser.secret = submittedSecret;
      foundUser.save();
      res.redirect("/secrets");
    }
    catch(err){
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
});

app.get("/logout", async function(req, res){
  req.logOut(function(err){
    if(err){
      console.log(err);
    }
     else{
      res.redirect("/");
     }
  });
});

app.post("/register", async function(req, res){
  User.register({username: req.body.username}, req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.redirect("/register");
    }
    else{
      passport.authenticate("local")(req, res,function(){
        res.redirect("/secrets");
      });
    }
  });
});

app.post("/login", async function(req, res){
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
    req.login(user, function(err){
      if(err){
        console.log(err);
        }
        else{
          passport.authenticate("local")(req, res,function(){
            res.redirect("/secrets");
          });
        }
    });
=======
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
>>>>>>> origin/main
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
  });

