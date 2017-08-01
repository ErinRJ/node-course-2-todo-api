const {ObjectID}= require('mongodb');

const {mongoose}= require('./../server/db/mongoose');
const {Todo}= require('./../server/models/todo');
const {User}= require('./../server/models/user');

// var id= '597fbd2958f01d5422b2ff8f11';

// //check if the ID is even a valid ID
// if(!ObjectID.isValid(id)){
//   console.log('That ID is not valid!');
// }

// //return the todos array
// Todo.find({
//   //mongoose takes the string and converts it to an object ID
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// //return a specific todo object
// //doesn't have to be by ID
// Todo.findOne({
//   //mongoose takes the string and converts it to an object ID
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });
//
// //return a specific todo object using ID ONLY
// Todo.findById(id).then((todo) => {
//   //let's handle the case where the id doesn't match any in the collection
//   if (!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo By Id', todo);
// }).catch((e) => console.log(e));
// //the catch method here checks whether the id is valid

//Let's try all this for the user models
//create the id
var id= '597e3b9e1a23c2c4388a1500';
//pass in the id
User.findById(id).then((user)=> {
  //check to make sure that user is actually included in the collection
  if(!user) {
    console.log('That user cannot be found');
  }
  //if that user exists, pretty print out their information
  console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => {
  console.log(e);
});
