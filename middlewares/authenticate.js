const jwt = require('jsonwebtoken');
const config = require('config');
const debug = require('debug')('app:debug');


module.exports = function (req, res, next) {
    debug('Initial');
    const token = req.header('x-auth-token');
    debug(token);
    if(!token) return res.status(400).send('Access Denied!Token not provided.');
    debug(token);
    try {
        debug(token);
        let decode = jwt.verify(token, config.get('jwtPrivateKey'));
        debug('5:' + token);
        req.user = decode;
        debug('6 :' + token);
        next();
    } catch(e) { return res.status(401).send('Invalid Token!');}
}