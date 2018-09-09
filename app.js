const express = require('express');
const bodyParser = require('body-parser');
const path =  require('path');
const mongoose = require('mongoose');
const exhbs = require('express-handlebars');
const contacts = require('./models/contacts.js');
const User = require('./models/users.js');
const ObjectID = require('mongodb');
const _ = require('lodash');

//port declaration
const port = process.env.PORT || 3000;
//app init
const app = express();

//setting up middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//view setup
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
//mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/contactapp');

//home page
app.get('/', (req, res, next) =>{
  contacts.find((err, contacts)=>{
    if(err){
      return console.log(err);
    }
    res.render('home', {
      contacts: contacts
    })
  });
});

app.get('/add', (req, res, next) =>{
  res.render('add');
});

//add contact
app.post('/contact/add', (req, res, next) =>{
  const record = new contacts({
    name: req.body.name,
    mo_no: req.body.number
  });
  record.save().then((doc) =>{
    console.log("contact added!");
  }, (e)=>{
    console.log("unable to add contact");
  });
  res.redirect('/');
});

//edit contact
app.get('/edit/:id', (req, res, next) =>{
  const q = {_id: req.params.id}
  contacts.findById(q, (err, doc)=>{
    if(err){
      return console.log(err);
    }
    console.log(doc);
    res.render('edit', {
      doc: doc
    });
  });
});

//edit and save contact
app.post('/edit/:id', (req, res, next) =>{
  const query = {_id : req.params.id}
  contacts.findOne(query, (err, doc) =>{
    if(err){
      return console.log(err);
    }
    doc.name = req.body.name;
    doc.mo_no = req.body.number;
    doc.save();
    console.log('contact updated...');
    res.redirect('/');
  });
});

//deleting contacts
app.delete('/delete/:id', (req, res, next) =>{
  const query = {_id: req.params.id}
  console.log(query);
  contacts.deleteOne(query, (err)=>{
    if(err){
      return console.log(err);
    }
    console.log("contact removed...");
    res.send(200);
  });
});

//login Users
app.get('/login', (req, res, next)=>{
  res.render('login');
});

//login system
app.post('/login/users', (req, res)=>{
  var body = _.pick(req.body, ['email','password']);
  User.findByCredentials(body.email, body.password).then((user)=>{
    return user.generateAuthToken().then((token)=>{
      res.redirect('/');
      res.header('x-auth',token).send(user);
    });
  }).catch((e)=>{
    res.status(400).send();
  });
});
//register Users
app.get('/register',(req,res)=>{
  res.render('register');
});

app.post('/register/users', (req, res, next) =>{
  var body = _.pick(req.body, ['name','email','password']);
  var user = new User(body);
  user.save().then(()=>{
    console.log('Registered successfully');
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(user)
  }).catch((e)=>{
    res.status(400).send();
    console.log(e);
  });
  res.redirect('/login');
});

var authenticate = (req, res, next)=>{
  var token = req.header('x-auth');
  User.findByToken(token).then((user)=>{
    if(!user){
      return Promise.reject();
    }
    req.user = user;
    req.token = token;
    next();
  }).catch((e)=>{
    res.status(400).send();
  });
}
//listen to port
app.listen(port, () =>{
  console.log("Server connected on " + port);
})
