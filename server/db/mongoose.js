var mongoose= require('mongoose');

//set it up to use promises
mongoose.Promise= global.Promise;
//connect to the mongoose localhost
mongoose.connect("mongodb://erj:30houses@ds127883.mlab.com:27883/first_todo_db" || 'mongodb://localhost:27017/TodoApp'); 
module.exports = {
  mongoose: mongoose
};
