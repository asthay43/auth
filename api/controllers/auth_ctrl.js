'use strict';

const mongoose = require('mongoose'),
    User = mongoose.model('User'),
    jwt = require('jsonwebtoken'),
    validator = require('../../config/validator.js'),
    Config = require('../../config/config.js').get(process.env.NODE_ENV || 'staging'),
    Constant = require('../../config/constant.js'),
    response = require('./../lib/response_handler'),
    commonQuery = require('./../lib/commonQuery'),
    mail = require('../lib/mail');
const bcrypt = require('bcrypt');
// Generate a salt
const salt = bcrypt.genSaltSync(10);

module.exports = {
    userRegister: userRegister,
    userLogin: userLogin,
    forgotPassword: forgotPassword,
    verifyForgotPassword: verifyForgotPassword,
};

/**
 * Function is use to sign up user account
 */
function userRegister(req, res) {
    try {
        let userInfo = {};
        let outputJSON = {};
        
        if ((req.body.email) && (req.body.password) && (req.body.firstname) && (req.body.lastname)) {
            if (validator.isEmail(req.body.email)) {
                User.find({
                    email: (req.body.email).toLowerCase(),
                    is_deleted: false
                }, {
                    email: 1
                }, function (err, email) {
                    if (err) {
                        res.json({
                            code: Constant.ERROR_CODE,
                            message: Constant.INTERNAL_ERROR
                        });
                    } else {
                        if (email.length && email[0].firstname != req.body.firstname && email[0].lastname != req.body.lastname) {
                            res.json({
                                code: Constant.ALLREADY_EXIST,
                                message: Constant.EMAIL_ALREADY_EXIST
                            });
                        } else {
                            var hash = bcrypt.hashSync(req.body.password, salt);
                            var userData = {
                                password: hash,
                                firstname: req.body.firstname,
                                lastname: req.body.lastname,
                                email: (req.body.email).toLowerCase(),
                                mobile_no: req.body.mobile_no,
                                name: req.body.firstname + " " + req.body.lastname,
                                is_active: false,
                                deleted: false,
                            };
                            var UsersRecord = new User(userData);
                            // call the built-in save method to save to the database
                            UsersRecord.save(function (err, userInfo) {
                                if (err) {
                                    console.log('errr ')
                                    res.json({
                                        code: Constant.ERROR_CODE,
                                        message: Constant.INTERNAL_ERROR
                                    });
                                } else {
                                    console.log('user info ', userInfo)
                                    res.json({
                                        code: Constant.SUCCESS_CODE,
                                        message: Constant.SIGNUP_SUCCESS
                                    });
                                   
                                }
                            });
                        }
    
                    }
                });
            } else {
                res.json({
                    code: Constant.ERROR_CODE,
                    message: Constant.INVALID_EMAIL
                });
            }
        } else {
            res.json({
                code: Constant.ERROR_CODE,
                message: 'sdafsdf'
            });
        }
    } catch (error) {
        console.log('error ', error);
    }
   
}

/**
 * Function is use to login user
  */

function userLogin(req, res) {
    async function asy_init() {
        try {
            if ((req.body.email) && (req.body.password)) {
                if (!validator.isEmail(req.body.email)) {
                    return response(res, Constant.ERROR_CODE, Constant.INVALID_EMAIL);
                }
                let condition = {
                    email: req.body.email.toLowerCase()
                };
                var user = await commonQuery.findoneData(User, condition);
                if (!user) {
                    return response(res, Constant.ERROR_CODE, Constant.EMAIL_NOT_FOUND);
                } else if (bcrypt.compareSync(req.body.password, user.password)) {
                    if (!user.is_active) {
                        return response(res, Constant.ERROR_CODE, 'Logged in');
                    } else if (user.is_deleted) {
                        return response(res, Constant.ERROR_CODE, 'deleted account');
                    } else {
                        let params = {
                            id: user._id,
                            email: user.email,
                            is_admin: 0
                        };
                        let jwtToken = jwt.sign(params, Config.SECRET, {
                            expiresIn: 60 * 60 * 168 * 1 // expiration duration 8 Hours
                        });
                        if (validator.isValid(jwtToken)) {
                            commonQuery.updateOneDocumentWithOutInserting(User, condition, {
                                resetPasswordToken: '',
                                last_login: new Date()
                            });
                            condition = {
                                user_id: user._id,
                                is_deleted: false,
                                status: 1
                            }
                            let cartsCount = await commonQuery.countData(CartsModel, condition);
                            return response(res, Constant.SUCCESS_CODE, Constant.SIGNIN_SUCCESS, user, {
                                cartsCount
                            }, 'Bearer ' + jwtToken);
                        } else {
                            return response(res, Constant.ERROR_CODE, Constant.SOMETHING_WENT_WRONG);
                        }
                    }
                } else {
                    return res.json({
                        code: Constant.ERROR_CODE,
                        message: Constant.INVALID_LOGIN_DETAILS
                    });
                }
            } else {
                return res.json({
                    code: Constant.ERROR_CODE,
                    message: Constant.LOGIN_REQUIRED_FIELDS
                });
            }
        } catch (e) {
            console.log(e);
            return res.json({
                code: Constant.ERROR_CODE,
                message: Constant.SOMETHING_WENT_WRONG
            });
        }
    }
    asy_init();

}


/**
 * Function is use to reset user password
 */
function forgotPassword(req, res) {
    async function asy_init() {
        try {
            if ((req.body.email) && validator.isEmail(req.body.email)) {
                let condition = {
                    email: req.body.email.toLowerCase()
                }
                commonQuery.findoneData(User, condition)
                    .then((userDetail) => {
                        if (userDetail) {
                            if (!userDetail.is_active)
                                return response(res, Constant.ERROR_CODE, Constant.VERIFY_ACCOUNT);
                            else if (userDetail.is_deleted)
                                return response(res, Constant.ERROR_CODE, Constant.ACCOUNT_DELETED);
                            else mail.sendResetPasswordEmail(userDetail)
                                .then((success) => {
                                    if (success && success.result && success.token) {
                                        let udpate_obj = {
                                            resetPasswordToken: success.token
                                        };
                                        commonQuery.updateOneDocumentWithOutInserting(User, condition, udpate_obj)
                                            .then(updated => {
                                                if (updated) {
                                                    return response(res, Constant.SUCCESS_CODE, Constant.PASSWORD_SENT_SUCCESS);
                                                } else {
                                                    return response(res, Constant.ERROR_CODE, Constant.PASSWORD_SENT_UNSUCCESS);
                                                }
                                            }).catch(err => {
                                                return response(res, Constant.ERROR_CODE, Constant.INTERNAL_ERROR);
                                            })
                                    } else {
                                        return response(res, Constant.ERROR_CODE, Constant.PASSWORD_SENT_UNSUCCESS);
                                    }
                                })
                                .catch((err) => {
                                    console.log(err)
                                    return response(res, Constant.ERROR_CODE, Constant.INTERNAL_ERROR);
                                })
                        } else {
                            return response(res, Constant.NOT_FOUND, Constant.EMAIL_NOT_REGISTRED);
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        return response(res, Constant.ERROR_CODE, Constant.INTERNAL_ERROR);
                    })
            } else {
                return response(res, Constant.ERROR_CODE, Constant.INVALID_EMAIL);
            }
        } catch (e) {
            console.log(e)
            return response(res, Constant.ERROR_CODE, Constant.INTERNAL_ERROR);
        }
    }
    asy_init();
}
/**
 * Function is use to verify forgot password link
 */
function verifyForgotPassword(req, res) {
    async function asy_init() {
        try {
            if (req.body.token && req.body.password) {
                let signed_token = jwt.verify(req.body.token, Config.SECRET);
                if (!signed_token) return response(res, Constant.REQ_DATA_ERROR_CODE, Constant.NOT_PROPER_DATA);
                let condition = {
                    is_active: true,
                    is_deleted: false,
                    email: signed_token.email,
                    resetPasswordToken: req.body.token
                }
                let hash = bcrypt.hashSync(req.body.password, salt);
                let user = await commonQuery.updateOneDocumentWithOutInserting(User, condition, {
                    password: hash,
                    resetPasswordToken: ''
                })
                if (user) {
                    return response(res, Constant.SUCCESS_CODE, Constant.PASSWORD_CHANGED_SUCCESS);
                } else {
                    return response(res, Constant.ERROR_CODE, Constant.SOMETHING_WENT_WRONG);
                }
            } else {
                return response(res, Constant.ERROR_CODE, Constant.NOT_PROPER_DATA);
            }
        } catch (err) {
            console.log(err)
            return response(res, Constant.ERROR_CODE, Constant.INTERNAL_ERROR);

        }
    }
    asy_init().then(dat => {});
}
