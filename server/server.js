//library imports
var express= require('express');
var bodyParser= require('body-parser');

//make an object id
var {ObjectID}= require('mongodb');

//local imports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app= express();

//deal with the middleware
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo= new Todo({
    text: req.body.text
  });

todo.save().then((doc) => {
  res.send(doc);
}, (e) => {
  res.status(400).send(e);
});
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});



//accessing the id from the user
//GET/todos/id#
app.get('/todos/:id', (req, res) => {
  var id= req.params.id;

  //validate the id using isValid
  if (!ObjectID.isValid(id)) {
    //404- send back empty send
    return res.status(404).send();
  }
  //find by id
  Todo.findById(id).then((todo) => {
    //woah there is an id!!! Does it have a todo with it?
    if (!todo){
      //send back a 404 with empty body
      return res.status(404).send();
    }
    //if the todo exists, send it back
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});


app.listen(3000, () => {
  console.log('Started on port 3000');
});



module.exports = {app};
