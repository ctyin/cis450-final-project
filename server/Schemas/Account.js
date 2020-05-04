const mongoose = require('mongoose');
let tripSchema = require('./Trip').tripSchema;

const Schema = mongoose.Schema;

const accountSchema = new Schema({
  username: { type: String, required: true, unique: true },
  lastname: { type: String, required: true, unique: false },
  firstname: { type: String, required: true, unique: false },
  password: { type: String, required: true, unique: false },
  routes: { type: [tripSchema], unique: false },
});

// export personSchema as a class called Person
module.exports = Account = mongoose.model('Account', accountSchema);
