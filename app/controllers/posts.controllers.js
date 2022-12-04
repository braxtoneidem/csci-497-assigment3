const Post = require("../models/post");
var Schema = require("../models/postDDB.js");


const homeStartingContent =
	'The home pages lists all the blogs from all the users.';



	const AWS = require('aws-sdk');
	const dynamoose = require("dynamoose");
	
	const express = require('express');
	const session = require('express-session');
	const DynamoDBStore = require('connect-dynamodb')(session);

	
	// AWS.config.update({
	// 	region: 'us-west-2',
	// 	endpoint: 'http://localhost:3000/' //the endpoint needs to be replaced with the real DynamoDB endpoint when done using localhost
	//   })
	
	
	
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
	
	const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2'});
	
	// app.use(session({
	// 	genid: (req) => {
	// 		return uuidv4() // use UUIDs for session IDs
	// 	},
	// 		cookie:
	// 		 secure: true
	// },
	// 	store: new DynamoDBStore(options), 
	// 	secret: 'secret',
	// 	resave: false,
	// 	cookie: {
	// 		maxAge: 5*60*1000, //set to 5 min 
	// 	},
	// 	saveUninitialized: false,
	// 	name: '_id',
	// 	rolling: true
	// }));
	
	

	// const schema = new dynamoose.Schema({
	// 	TableName: 'assignment3',
	// 	"_id": String,
	// 	"age": {
	// 		"type": Number,
	// 		"default": 5
	// 	}
	// });



	//   const postSchema = new mongoose.Schema({
	// 	username: {
	// 		type: String,
	// 		lowercase: true,
	// 		required: [ true, "can't be blank" ],
	// 		match: [ /^[a-zA-Z0-9]+$/, 'Invalid username' ],
	// 		index: true,
	// 		unique: true
	// 	},
	// 	title: { type: String, required: [ true, "can't be blank" ] },
	// 	content: { type: String, required: [ true, "can't be blank" ] }
	// });
	  
	//   docClient.put(params, function(err, data) {
	// 	if (err) {
	// 	  console.log("Error", err);
	// 	} else {
	// 	  console.log("Success", data);
	// 	}
	//   });








var count = 1;

const composePost = (req, res) => {

	const post = new Post({
    username: req.user.username,
		title: req.body.postTitle,
		content: req.body.postBody
	});

	// post.save(); // should work still. if not look at dynamoose man: item




	var params = {
		TableName: 'assignment3-v2',
		Item: {
			'_id': ''+count,
			'username':req.user.username,
			'title': req.body.postTitle,
			'content': req.body.postBody,
			'postTag': 0
		}
  	};




	docClient.put(params, function(err, data) {
		if (err) {
		  console.log("Error", err);
		} else {
		//   console.log("Success", data);
		}
	  });


	  count++;
	

	res.redirect('/post');
};







/***********************************   mongo  *******************************************/



const displayAllPosts = (req, res) => {


    var posts = [];

    for(var i=0; i < count; i++){
            var params = {
                TableName: 'assignment3-v2',
                Key: {
                    '_id': ''+i,
                }
            };

            docClient.get(params, function(err, data) {
                if (err) {
                    console.log("Error", err);
                } else {
                    console.log("Success", data.Item);
                    posts.push(data.Item);
                }})

        }//end of for loop

        setTimeout(() => {
            console.log('waited for 5 seconds')
            console.log("test", posts);
                    res.render('home', {
                        startingContent: homeStartingContent,
                        posts: posts
                    });
        }, 5000)
};





async function displayPost (req, res)  {
	const requestedPostId = req.params.postId;
	var params = {
		TableName: 'assignment3-v2',
		Key: {
			'_id': ''+req.params.postId,
		}
	  };
	  
	  docClient.get(params, function(err, data) {
		if (err) {
		  console.log("Error", err);
		} else {
		//   console.log("Success", data.Item);

		  res.render('post', {
			title: data.Item.title,
			content: data.Item.content
		});
		}})

		
	// Post.findOne({ _id: requestedPostId }, function(err, post) {
	// 	// res.render('post', {
	// 	// 	title: post.title,
	// 	// 	content: post.content
	// 	// });
	// });


};


module.exports = {
	displayAllPosts,
	displayPost,
    composePost
};






// const displayAllPosts = (req, res) => {
	
// 	// console.log(res);
// 	// console.log(req.params.postId);
// 	Post.query('post_id').exec((err, posts) => { // if not {}: Post.query('posts').exec((err, posts) {  //'posts' being the hashkey of the table 
// 		if (err) {
// 			console.error(err);
// 		} else {
// 		res.render('home', {
// 			startingContent: homeStartingContent,
// 			posts: posts
// 		});}
// 	});
// };


// async function displayPost (req, res)  {
// 	const requestedPostId = req.params.postId;

// 	Post.query('post_id').eq(requestedPostId).exec((err, post) => { // Post.query("postId").eq(requestedPostId).exec((err, post))
// 		res.render('post', {
// 			title: post.title,
// 			content: post.content
// 		});
// 	});
// };

