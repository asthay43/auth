'use strict';

let mongoose = require('mongoose');
let UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    mobile_no: {
        type: String
    },
    is_active: {
        type: Boolean,
        default: false
    },
    is_deleted: {
        type: Boolean,
        default: false
    },

    created_date: {
        type: Date,
        default: Date.now
    },
    last_login: {
        type: Date
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
}, {
    timestamps: true
});

let User = mongoose.model('User', UserSchema);

module.exports = User;