var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tripSchema = new Schema({
  sourceCity: {
    type: Number,
    required: true,
    unique: false,
  },
  destinationCity: {
    type: Number,
    required: true,
    unique: false,
  },
  distance: {
    type: Number,
    required: true,
    unique: false,
  },
  vehicle: {
    type: Number,
    required: true,
    unique: false,
  },
  user: { type: String, required: true, unique: false },
});

// export tripSchema as a model called Person
module.exports = Trip = mongoose.model('Trips', tripSchema);
