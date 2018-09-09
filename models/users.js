const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    tokens: [{
      access: {
        type: String,
        required: true
    },
      token: {
        type: String,
        required: true
      }
    }]
});

//hiding tokens
UserSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();
  return _.pick(['_id','name','email']);
}

//finding users
UserSchema.statics.findByCredentials = function(email, password){
 var user = this;
 return user.findOne({email}).then((user)=>{
   if(!user){
     return Promise.reject();
   }
   return new Promise((resolve, reject)=>{
     bcrypt.compare(password, user.password, (err, res)=>{
       if(res){
         resolve(user);
       }
       else {
         reject();
       }
     })
   })
 })
}

//generating authtoken
UserSchema.methods.generateAuthToken = function(){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});
  return user.save().then(()=>{
    return token;
  });
}

UserSchema.pre('save', function (next) {
  var user = this;
  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt)=>{
      bcrypt.hash(user.password, salt, (err, hash)=>{
        user.password = hash;
        next();
      });
    });
  }else{
    next();
  }
});
var User = mongoose.model('User', UserSchema);
module.exports = User;