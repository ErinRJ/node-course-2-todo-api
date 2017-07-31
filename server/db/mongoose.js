var mongoose= require('mongoose');

//set it up to use promises
mongoose.Promise= global.Promise;
//connect to the mongoose localhost
mongoose.connect('mongodb://localhost:27017/TodoApp');
module.exports = {
  mongoose: mongoose
};
