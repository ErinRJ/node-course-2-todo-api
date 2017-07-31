var mongoose= require('mongoose');

//create a model of a todo entry
var Todo= mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minLength: 1,
    //trim any beginning/ending empty spaces
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

module.exports = {Todo};
