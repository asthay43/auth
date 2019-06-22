'use strict';

// const SwaggerExpress = require('swagger-express-mw');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const app = express();
const compression = require('compression');
module.exports = app; // for testing
require('./config/db');
const utils = require('./api/lib/util');
const config = {
    appRoot: __dirname // required config
};
const auth = require('./api/controllers/auth_ctrl.js');
console.log('Enviroment==', process.env.NODE_ENV || 'staging');
app.use(bodyParser.json({
    limit: '2GB'
}));
app.use(bodyParser.urlencoded({
    limit: '2GB',
    extended: true
}));
// SwaggerExpress.create(config, function (err, swaggerExpress) {
//     if (err) {
//         throw err;
//     }
    // All api requests
    app.use(function (req, res, next) {
        // CORS headers
        res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        // Set custom headers for CORS
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,If-Modified-Since,Authorization');

        if (req.method == 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    });

    //compression
    app.use(compression({
        filter: shouldCompress
    }))

    function shouldCompress(req, res) {
        if (req.headers['x-no-compression']) {
            // don't compress responses with this request header
            return false
        }
        // fallback to standard filter function
        return compression.filter(req, res)
    }

    //Check to call web services where token is not required//
    app.post('/api/user/signup', auth.userRegister);
    app.post('/api/user/login', auth.userLogin );
    // app.use('/api/*', function (req, res, next) {
    //     const freeAuthPath = [
    //         '/api/user/signup',
    //         '/api/user/login',
    //     ];

    //     const available = freeAuthPath.includes(req.baseUrl) || false;
    //     const is_free_auth = req.baseUrl.split('/f/').length > 1 ? ((req.headers["authorization"] || req.query["api_key"]) ? false : true) : false;
       
    //     if (!available && !is_free_auth) {
    //         utils.ensureAuthorized(req, res, next);
    //     } else {
    //         next();
    //     }
    // });

    // enable SwaggerUI
    // app.use(swaggerExpress.runner.swaggerTools.swaggerUi());

    // install middleware
    // swaggerExpress.register(app);

    const port = process.env.PORT || 5130;
    app.listen(port);    
        console.log('try this:\ncurl http://localhost:' + port ); 

// });