// const dynamoose = require("dynamoose");

// const postSchema = new dynamoose.Schema({
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

// module.exports = dynamoose.model("Post", postSchema);

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
	username: {
		type: String,
		lowercase: true,
		required: [ true, "can't be blank" ],
		match: [ /^[a-zA-Z0-9]+$/, 'Invalid username' ],
		index: true,
		unique: true
	},
	title: { type: String, required: [ true, "can't be blank" ] },
	content: { type: String, required: [ true, "can't be blank" ] }
});


module.exports = mongoose.model("Post", postSchema);





// var Params = {
// 	TableName: 'assignment3',
// 	Item: {
// 	  '_id': 11,

// 	  username: {
// 		type: String,
// 		lowercase: true,
// 		required: [ true, "can't be blank" ],
// 		match: [ /^[a-zA-Z0-9]+$/, 'Invalid username' ],
// 		index: true,
// 		unique: true
// 	},
// 	title: { type: String, required: [ true, "can't be blank" ] },
// 	content: { type: String, required: [ true, "can't be blank" ] }
// 	}
//   };