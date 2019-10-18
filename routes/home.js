const express = require('express');

const routes = express.Router();

routes.get('/', (req, res) => {
    res.send('This is a response page');
});

module.exports = routes;