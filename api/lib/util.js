'use strict';

const jwt = require('jsonwebtoken');
const  User = require('../models/Users');
const config = require('../../config/config.js').get(process.env.NODE_ENV || 'staging');
 
module.exports = {
    ensureAuthorized: ensureAuthorized
}

function ensureAuthorized(req, res ,next) {
    var bearerToken;    
    var bearerHeader = req.headers["authorization"] || req.query["api_key"];    
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;        
        jwt.verify(bearerToken, config.SECRET, function(err, decoded) {
            req.user = decoded;            
            if (err) {
                return res.send({ code: 401, message: 'Invalid Token!' });
            }
            next();
        });
    } else {
        return res.send({ code: 401, message: 'Token not found!' });
    }
}
