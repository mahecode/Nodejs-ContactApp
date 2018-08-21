const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/contactapp');

//contact schema
const contactSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  mo_no: {
    type: Number,
    required: true
  }
});

const Contact = module.exports = mongoose.model('Contact', contactSchema);
