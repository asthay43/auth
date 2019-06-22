'use strict';

const config = {
    local: {
        SECRET: 'crm@$12&*01',
        // WEB_URL: 'http://localhost:5130/api/',
        // WEB_FRONTEND_URL: 'http://localhost:4200/',
        // EMAIL_FROM: '"Uber Murals" <elemtnsigns@gmail.com>',
        // SMTP: {
        //     service: 'gmail',
        //     host: 'smtp.gmail.com',
        //     secure: false,
        //     port: 465,
        //     authUser: 'elemtnsigns@gmail.com',
        //     authpass: 'elemtnsigns123'
        // },
        DATABASE: {
            dbname: 'edwisor',
            host: 'mongodb://localhost/',
            username: '',
            password: ''
        }
    },
};
module.exports.get = function get(env) {
    return config[env] || config.default;
}