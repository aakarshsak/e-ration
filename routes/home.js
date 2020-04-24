const express = require('express');

const routes = express.Router();

routes.get('/', (req, res) => {
    res.render('./index.ejs');
});

routes.get('/login_page', (req, res) => {
    res.render('./login.ejs');
});

routes.get('/registration_page', (req, res) => {
    res.send('Hi This is a response!!!');
});

module.exports = routes;