const express = require('express'),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose")
    ObjectID = require('mongodb').ObjectID,
    ObjectID.createFromHexString('55153a8014829a865bbf700d'),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require("./models/user"),
    seedDB = require('./seeds')

// requiring routes
const commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")

var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_v12_deployed"
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();  //seed the DB

app.locals.moment = require('moment');

// PASSPORT CONFOGURATION
app.use(require("express-session")({
    secret: "Once again Cr7 wins!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next();
})


app.use("/", indexRoutes); //prefix- for shorter route declaration
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, function() {
    console.log("The YelpCamp Server Has Started")
});
