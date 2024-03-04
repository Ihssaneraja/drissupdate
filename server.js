

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");

const app = express();

const http = require("http").Server(app);

const io = require("socket.io")(http);


const bcrypt = require("bcrypt");
  const passport = require("passport");
  const initializePassport = require("./passport-config");
  const flash = require("express-flash");
  const session = require("express-session");
  const methodOverride = require("method-override");
  const sharedSession = require("express-socket.io-session");
  const path = require('path');

  initializePassport(
    passport,
    (email) => Users.find((user) => user.email === email),
    (id) => Users.find((user) => user.id === id)
  );

// const users = {};

const Users = [];
  
  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  });

  app.use(express.urlencoded({ extended: false }));
  app.use(flash());
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(methodOverride("_method"));
  


io.use(sharedSession(sessionMiddleware, { autoSave: true }));
  
app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}))

app.post("/Register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    Users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    console.log(Users);
    res.redirect("/login");
  } catch (e) {
    console.log(e);
    res.redirect("/Register");
  }
});

app.get('/', checkAuthenticated, (req, res) => {
  res.render("index.ejs", {name: req.user.name})
})

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.get("/Register", checkNotAuthenticated, (req, res) => {
  res.render("Register.ejs");
});

app.delete("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
});


function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
      return next()
  }
  res.redirect("/login")
}

function checkNotAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return res.redirect("/")
  }
 next()
}


io.on("connection", function (socket) {
    console.log('A new client has connected to the server');

    socket.on("message", (data ,userId) => {
        console.log(`Message :${data}` ,`User id :${userId}`);

        io.emit('message', {message: data, sender :userId});
    });
});


app.use(express.static('public'));


app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));







http.listen(5000, () => {
  console.log('http://localhost:5000');
})