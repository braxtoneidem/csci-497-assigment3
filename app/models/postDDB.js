
const dynamoose = require("dynamoose");



const schema = new dynamoose.Schema({
	"_id": String,
	"username": {type: String},
	"title": {type: String},
	"content": {type: String},
	
	}
);

// module.exports = dynamoose.model("Schema", schema);



// module.exports = {
//     TableName: "assignment3",
//     Item: {
//         "_id": String,
//         "username": {type: String},
//         "title": {type: String},
//         "content": {type: String},
//     },
// };





// // const dynamoose = require("dynamoose");
// const schema = new dynamoose.Schema(
//   {
//     _id: { S: "-1" },
//     username: { S: "-1" },
//     title: { S: "-1" },
//     content: { S: "-1" },
//   }
// );

return (stage, date) => dynamoose.model('assignment3', schema, options);