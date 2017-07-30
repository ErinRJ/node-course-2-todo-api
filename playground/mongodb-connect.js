// const MongoClient = require('mongodb').MongoClient
//ObjectID allows to create object ids on the fly
const {MongoClient, ObjectID} = require('mongodb');
//object destructuring- pull things out of objects to create variables


//connect to the db
//(url, callback)
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if(err){
  //     return console.log('Unable to insert todo', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  //insert new doc into the users collection with (name, age, location) properties.

  // db.collection('Users').insertOne({
  //   name: 'theBestWalrus',
  //   age:147,
  //   location: 'Santa Fe'
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert User', err);
  //   }
  //   console.log(result.ops[0]._id.getTimestamp());
  // });

  db.close();
});
