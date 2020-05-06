const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accountSchema = new Schema({
  username: { type: String, required: true, unique: true },
  lastname: {
    type: String,
    required: true,
    unique: false,
  },
  firstname: {
    type: String,
    required: true,
    unique: false,
  },
  password: {
    type: String,
    required: true,
    unique: false,
  },
  routes: { type: Array, default: [], unique: false },
});

// export personSchema as a class called Person
module.exports = Accounts = mongoose.model('Accounts', accountSchema);
