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

// //update an item and get the new item back
// db.collection('Todos').findOneAndUpdate({
//   _id: new ObjectID('597e045173698ae6c6fb4f86')
// }, {
//   $set: {
//     completed: true
//   }
// }, {
//   returnOriginal: false
// }).then((result) => {
//   console.log(result);
// });

//let's update the user's information
db.collection('Users').findOneAndUpdate({
  _id: new ObjectID('596ffb03a140dc22d878166a')
}, {
  $set: {
    name: 'Roy'
  },
  $inc: {
    age: -120
  }
},
  {returnOriginal: false}
). then((result) => {
  console.log(result);
});

//db.close();
});
