const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');
const errorhandler = require('errorhandler');

const app = express();

app.use(errorhandler({ log: errorNotification }))
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', () => {
    return;
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