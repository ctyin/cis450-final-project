var mongoose = require('mongoose');

require('dotenv').config();
const myPassword = process.env.pwd;
mongoose.connect(`mongodb+srv://ctyin:${myPassword}@cluster0-u7inq.mongodb.net/test?retryWrites=true&w=majority`, {useNewUrlParser: true});

var Schema = mongoose.Schema;

var tripSchema = new Schema({
	sourceCity: {type: String, required: true, unique: false},
	destinationCity: {type: String, required: true, unique: false},
    distance: {type: String, required: true, unique: false},
	saltedPassword: {type: String, required: true, unique: false},
});

// export tripSchema as a model called Person
let tripModel = mongoose.model('Trip', tripSchema);
module.exports = {tripSchema, tripModel};