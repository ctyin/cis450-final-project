const mongoose = require('mongoose');
let tripSchema = require('./Trip').tripSchema;

require('dotenv').config();
const myUsername = process.env.dbusername;
const myPassword = process.env.pwd;
mongoose.connect(`mongodb+srv://${myUsername}:${myPassword}@cluster0-u7inq.mongodb.net/test?retryWrites=true&w=majority`, {useNewUrlParser: true});

var Schema = mongoose.Schema;

var accountSchema = new Schema({
	username: {type: String, required: true, unique: true},
	lastname: {type: String, required: true, unique: false},
	firstname: {type: String, required: true, unique: false},
	saltedPassword: {type: String, required: true, unique: false},
	routes: {type: [tripSchema], unique: false},
    });

// export personSchema as a class called Person
module.exports = mongoose.model('Account', accountSchema);