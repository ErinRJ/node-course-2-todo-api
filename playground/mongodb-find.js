// const MongoClient = require('mongodb').MongoClient
//ObjectID allows to create object ids on the fly
const {MongoClient, ObjectID} = require('mongodb');
//object destructuring- pull things out of objects to create variables
var ObjectId = require('mongodb').ObjectID;

//connect to the db
//(url, callback)
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

//get the todo you want
//this returns a mongodb cursor
// db.collection('Todos').find({
//   _id: new ObjectID('596ff8d82abec82a848614c2')
// }).toArray().then((docs) => {
//   console.log('Todos');
//   console.log(JSON.stringify(docs, undefined, 2));
// }, (err) => {
//   console.log('Unable to fetch todos', err);
// });

// db.collection('Todos').find().count().then((count) => {
//   console.log(`Todos count: ${count}`);
// }, (err) => {
//   console.log('Unable to fetch todos', err);
// });

db.collection('Users').find({name: 'theBestWalrus'}).toArray().then((docs) => {
  console.log('The Users: ');
  console.log(JSON.stringify(docs, undefined, 2));
}, (err) => {
  console.log('Unable to fetch the users');
});

//db.close();
});
