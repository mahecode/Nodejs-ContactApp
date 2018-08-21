const express = require('express');
const bodyParser = require('body-parser');
const path =  require('path');
const mongoose = require('mongoose');
const exhbs = require('express-handlebars');
const contacts = require('./models/contacts.js');
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

//listen to port
app.listen(port, () =>{
  console.log("Server connected on " + port);
})
