require('dotenv').config();
const express = require('express');
const config = require('./config/config');
const compression = require ('compression');
const helmet = require('helmet');
const https= require("https");
const fs = require('fs');


const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');


const User = require("./models/user");

const userRouter = require('./routes/user.routes');
const postRouter = require('./routes/post.routes');


const app = express();

app.set('view engine', 'ejs');
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
app.use(mongoSanitize());
app.use(express.static('public'));

  
app.set('trust proxy', 1); // trust first proxy

const port = 3000;//config.get('port') || 3000;
const blogDB = process.env.DB_NAME

const blog_db_url =
	process.env.DB_URL +
	process.env.MON_PASS +
	process.env.DB_HOST +
	blogDB +
	'?retryWrites=true&w=majority';

const dbConnection = mongoose.connect(blog_db_url, (err) => {
  if(err){
    console.log(err)
  }
});

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
    store: MongoStore.create({
      mongoUrl: blog_db_url,
      ttl: 2 * 24 * 60 * 60
    }),
		saveUninitialized: false,
		cookie: { secure: 'auto' }
	})
);



app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

app.use(function(req, res, next) {
	res.locals.isAuthenticated=req.isAuthenticated();
	next();
});

app.use('/user', userRouter);
app.use('/post', postRouter);

app.all('*', function(req, res) {
  res.redirect("/post/about");
});

const http = require('http');
const server = http.createServer(app).listen(port,() => {
console.log('Listening ...Server started on port ' + port);
})

module.exports = app;