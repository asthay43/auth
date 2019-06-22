'use strict';

const config = {
    local: {
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