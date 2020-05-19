/****************************************************************************** *

    This is the web application main file to run the application.
    WARNING : Do not make any changes to the file otherwise the application will break.


*********************************************************************************/

/*Node package manager modules*/
const express = require('express');  //express backend framework package
const morgan = require('morgan');       //http request logger package for developement
const debug = require('debug')('app:debug');  //debug package to get the debugging messages to the console
const config = require('config');   //to setup the configuration environment
const mongoose = require('mongoose');   //mongoose module to interact with the mongodb database
const cors = require('cors');
var bodyParser = require("body-parser");


/*Custom made local modules*/
const home = require('./routes/home');  //home route of the web application
const users = require('./routes/users'); //user registration route of the web app
const auth = require('./routes/auth');  //Authentication route for user login
 

/*Custom Variables initialization*/
if(!config.get('jwtPrivateKey')){
    console.log('FATAL ERROR!  jwtPrivateKey NOT INITIALISED IN CUSTOM VARIABLES');
    process.exit(-1);
}
const record = require('./routes/record');
const app = express();   //Making an instance of the express application
app.use(bodyParser.urlencoded({ extended: false }));


mongoose.connect('mongodb://localhost/e-ration',{ useNewUrlParser: true } )
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));


debug(app.get('env'));
debug(config.get('name'));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));
if(app.get('env') == 'development')
    app.use(morgan('tiny'));
app.use(express.static('public'));


//Calling the custom made routes
app.use('/', home);
app.use('/user/register', users);
app.use('/user/login', auth);
app.use('/record', record);

const port = process.env.PORT || config.get('port');  //defining the port to the application in the environment variables or 3000.

app.listen(port, () => {
    console.log(`Listening on port : ${port}`);
});