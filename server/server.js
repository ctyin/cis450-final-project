const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');
const errorhandler = require('errorhandler');
const mongoose = require('mongoose');

// Connect to MongoDB Atlas cluster
// change the pwd in your .env file to the Atlas password
require('dotenv').config();
const myUsername = process.env.dbusername;
const myPassword = process.env.pwd;
mongoose.connect(`mongodb+srv://${myUsername}:${myPassword}@cluster0-u7inq.mongodb.net/test?retryWrites=true&w=majority`, {useNewUrlParser: true});

//MongoDB Schema Imports
let Account = require('./Schemas/Account');
let Trip = require('./Schemas/Trip').tripModel;

const app = express();

app.use(errorhandler({ log: errorNotification }))
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


/************ BEGIN ROUTES ************/

app.get('/', (req, res) => {
  Account.find({}, (err, account) => {
    if (err) {
      res.json({});
      console.log(err.message);
    }
    
    console.log(account)
    res.json(account);
  });
})

// SQL Query #1
app.get('/epaRatingDist', routes.getCars);

app.get('/test', routes.test);


function errorNotification (err, str, req) {
    var title = 'Error in ' + req.method + ' ' + req.url
   
    notifier.notify({
      title: title,
      message: str
    })
  }

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});