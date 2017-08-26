const {ObjectID}= require('mongodb');

const {mongoose}= require('./../server/db/mongoose');
const {Todo}= require('./../server/models/todo');
const {User}= require('./../server/models/user');


// Todo.remove({}).then((result) => {
//   console.log(result);
// });

//find a document and remove it- it also returns the document
// Todo.findOneAndRemove({_id: ''}).then ((todo) => {
//
// });

//find a doc by id and removes it- it also returns the document
Todo.findByIdAndRemove('59a1fdcc77f3a15b1ac26fdd').then((todo) => {
  console.log(todo);
});
