const mongoose= require('mongoose');
const validator= require('validator');
const jwt= require('jsonwebtoken');
const _ = require('lodash');
const bcrypt= require('bcryptjs');

//store the schema (the properties) of the user
var UserSchema = new mongoose.Schema( {
  email: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    //verify the email doesn't have the same value as any other email in the user collection
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password:{
    type: String,
    required:true,
    minLength: 6
  },
  tokens: [{
    //specify all the properties available on a tokens
    access: {
      type:String,
      required:true
    },
    token: {
      type:String,
      required:true
    }
  }]
});

//a function to determine what exactly gets sent back when a mongoose model is converted to JSON value
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
}


//store the individual document by using a regular function as opposed to an => function
UserSchema.methods.generateAuthToken = function () {
  var user= this;
  var access= 'auth';
  var token= jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

//statics, everything you add on turns into a model object
UserSchema.statics.findByToken = function (token) {
  //verify the token
  var User = this;
  var decoded;

  try{
    decoded= jwt.verify(token, 'abc123');
  } catch (e) {
      return Promise.reject();
  }

  //success case- if able to decode
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};


UserSchema.pre('save', function (next) {
  var user= this;

  //check if the password was modified
  if (user.isModified('password')) {
    //call gensalt and hash
    bcrypt.genSalt(10, (err, salt) => {
      //let's hash it
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password=hash;
        next();
      });
    });   
  } else {
    next();
  }
});

var User= mongoose.model('User', UserSchema);

module.exports = {User};
