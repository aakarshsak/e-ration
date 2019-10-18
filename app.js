/****************************************************************************** *

    This is the web application main file to run the application.
    WARNING : Do not make any changes to the file otherwise the application will break.


*********************************************************************************/

/*Node package manager modules*/
const express = require('express');  //express backend framework package
const morgan = require('morgan');       //http request logger package for developement
const debug = require('debug')('app:debug');  //debug package to get the debugging messages to the console
const config = require('config');   //to setup the configuration environment


/*Custom made local modules*/
const home = require('./routes/home');  //home route of the web application

const app = express();   //Making an instance of the express application

app.use(express.json());
if(app.get('env') == 'developement')
    app.use(morgan('tiny'));
app.use(express.static('public'));

app.use('/home', home);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    debug(`Listening on port : ${port}`);
});