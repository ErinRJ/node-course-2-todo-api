const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId= new ObjectID();
const userTwoId= new ObjectID();
const users = [{
  _id: userOneId,
  email: 'IamSoTired@wannaGoHome.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId.toHexString(), access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  email: "thisisSecond@email.com",
  password: 'userTwoPass'
}]

const todos= [{
  _id: new ObjectID(),
  text: 'First test todo'},
  { _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];

//test the todos collection to see if there's any todos in there before we start the code
//runs before each test case
//only proceeds to the test case once done() is called

const populateTodos = (done) => {
  //remove all todos
  Todo.remove({}).then(() => {
    Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    //promise all waits for all the saves to be complete
    Promise.all([userOne, userTwo])
  }).then(() => done());
  };

module.exports = {todos, populateTodos, users, populateUsers};
