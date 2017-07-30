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

//deleteMany
// db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
//   console.log(result);
// });

// //deleteOne
//   db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
//     console.log(result);
//   });
//
// //findOneAndDelete
// db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
//   console.log(result);
// });

//let's use this on the Users collection now
db.collection('Users').findOneAndDelete({
  _id: new ObjectID('596ffa138bb88a1ddc508ea8')
}).then((result) =>{
  console.log(JSON.stringify(result,undefined,2));
});


//db.close();
});
