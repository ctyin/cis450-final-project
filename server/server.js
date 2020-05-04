const bodyParser = require('body-parser');
const express = require('express');
var routes = require('./routes.js');
const cors = require('cors');
const errorhandler = require('errorhandler');
const mongoose = require('mongoose');
const passport = require('passport');
let config = require('./db-config.js');
const oracledb = require('oracledb');

// Connect to MongoDB Atlas cluster
// change the pwd in your .env file to the Atlas password
require('dotenv').config();
const myUsername = process.env.dbusername;
const myPassword = process.env.pwd;
mongoose.connect(
  `mongodb+srv://${myUsername}:${myPassword}@cluster0-u7inq.mongodb.net/test?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
);

//MongoDB Schema Imports
let Account = require('./Schemas/Account');
let Trip = require('./Schemas/Trip').tripModel;

const app = express();

app.use(errorhandler({ log: errorNotification }));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

require('./passport')(passport);

/************ BEGIN ROUTES ************/

app.post('/register', routes.register);

app.post('/login', routes.login);

// SQL Query #1a
app.get('/twocities/:city1/:city2', routes.twoCities);

// SQL Query #1b
app.get('/epascore/:id', routes.getEpaScore);

// SQL Query #2
app.get('/efficientVehicles/:year', routes.mostEfficientVehicles);

// SQL Query #3
app.get('/rankmpg', routes.rankByMPG);

// SQL Query #4
app.get('/bestElectric/:state', routes.bestElectric);

// SQL Query #5
app.get('/epowerPairs', routes.bestElectricPowerplantPairs);

// SQL Query #6
app.get('/fueltype/:state', routes.typeOfFuel);

app.get('/allcities', routes.getAllCities);

app.get('/allmakes', routes.getAllMakes);

app.get('/models/:make', routes.getModels);

app.get('/years/:make/:model', routes.getYears);

app.get('/vehicle/:id', routes.getCarInfo);

function errorNotification(err, str, req) {
  var title = 'Error in ' + req.method + ' ' + req.url;

  notifier.notify({
    title: title,
    message: str,
  });
}

app.listen(8081, () => {
  console.log(`Server listening on PORT 8081`);
});
