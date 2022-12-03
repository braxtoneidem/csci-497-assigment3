require('dotenv').config();
const express = require('express');
const config = require('./config/config');
const compression = require ('compression');
const helmet = require('helmet');
const https= require("https");
const fs = require('fs');

const dynamoose = require("dynamoose");
/*
assignment3 iam access key

AKIAWPUZBM5BNDVCLUU7
K2C1s3mLKwtSr0CBZRIN7QV3drRd65vw+lnmWwg5
*/





const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');


const AWS = require('aws-sdk');
const DynamoDBStore = require('connect-dynamodb')(session);
// AWS.config.update({
// 	region: 'us-west-2',
// 	endpoint: 'http://localhost:3000/' //the endpoint needs to be replaced with the real DynamoDB endpoint when done using localhost
//   })



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

const port = 8000;//config.get('port') || 3000;
const blogDB = config.get('db.name')

const blog_db_url =
	config.get('db.db_url') +
	config.get('db.password') +
	config.get('db.host') +
	blogDB +
	'?retryWrites=true&w=majority';

const dbConnection = mongoose.connect(blog_db_url, (err) => {
  if(err){
    console.log(err)
  }
});

app.use(
	session({
		secret: config.get('secret'),
		resave: false,
    store: MongoStore.create({
      mongoUrl: blog_db_url,
      ttl: 2 * 24 * 60 * 60
    }),
		saveUninitialized: false,
		cookie: { secure: 'auto' }
	})
);
/*
// Create new DynamoDB instance
const ddb = new dynamoose.aws.ddb.DynamoDB({
    "accessKeyId": "AKIAWPUZBM5BNDVCLUU7",
    "secretAccessKey": "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",
    "region": "us-west-2"
});

// Set DynamoDB instance to the Dynamoose DDB instance
dynamoose.aws.ddb.set(ddb);
*/


const options = {   
    table: 'assignment3',   

    AWSConfigJSON: {
            // accessKeyId: process.env.ACCESSKEYID,
            // secretAccessKey: process.env.SECRETACCESSKEY,
			accessKeyId: 'AKIAWPUZBM5BNDVCLUU7',
			secretAccessKey: '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',
            region: 'us-west-2'
    }
}

app.use(session({
    genid: (req) => {
        return uuidv4() // use UUIDs for session IDs
    },
        cookie: {
         secure: true
},
    store: new DynamoDBStore(options), 
    secret: 'secret',
    resave: false,
    cookie: {
        maxAge: 5*60*1000, //set to 5 min 
    },
    saveUninitialized: false,
    name: '_id',
    rolling: true
}));

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