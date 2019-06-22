 'use strict';
 /*
  * Utility - utility.js
  */
 var mongoose = require('mongoose');
 var path = require('path');
 var nodemailer = require('nodemailer');
 var config = require('../../config/config');
 
 var jwt = require('jsonwebtoken');
 
 var utility = {};

 utility.sendmail = function (to, subject, message, callback) {
     console.log("inside send mail");
     var smtpTransport = nodemailer.createTransport({
         service: 'gmail', //config.SMTP.service 
         host: 'smtp.gmail.com', //config.SMTP.host,
         port: 465, //config.SMTP.port,
         secure: true, //config.SMTP.secure,
         auth: {
             user: 'syncitsdn@gmail.com', //config.SMTP.authUser,
             pass: 'syncitsdn@2017', // config.SMTP.authpass
         }
     });

     var mailOptions = {
         to: to,
         from: '"Syncitt" <syncitsdn@gmail.com>', // config.SMTP.authUser,
         subject: subject,
         html: message
     };
     console.log("mailOptions", mailOptions);
     smtpTransport.sendMail(mailOptions, function (err) {
         if (err) {
             console.log(err, 'mail send Error');
             callback(err);
         } else {
             console.log('info', 'An e-mail has been sent to  with further instructions.');
             callback(null, true);
         }
     });
 }

 utility.capitalize = function (input) {
     return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
 }

 utility.generateRandomString = function () {
     var text = "";
     var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

     for (var i = 0; i < 6; i++)
         text += possible.charAt(Math.floor(Math.random() * possible.length));

     return text;

 }

 utility.generateRandomStringUsingMathRandom = function () {
     return Math.random().toString(36).substring(2);
 }

 
 utility.is_user_login = function (user_obj) {
     if (user_obj && user_obj.id) {
         return user_obj.is_admin == 0 ? true : false;
     }
     return false;
 }
 module.exports = utility;