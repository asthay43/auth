const nodemailer = require('nodemailer'),
    config = require('../../config/config').get(process.env.NODE_ENV || 'staging'),
    constants = require('../../config/constant'),
    utility = require('./utility');

module.exports = {
    sendMail
}


function sendMail(to, subject, message, attachments = []) { // attachments is an array
    return new Promise((resolve, reject) => {
        if (to && subject && message) {
            let smtpTransport = nodemailer.createTransport({
                service: config.SMTP.service,
                host: config.SMTP.host,
                port: config.SMTP.port,
                secure: config.SMTP.secure,
                auth: {
                    user: config.SMTP.authUser,
                    pass: config.SMTP.authpass
                }
            });

            let mailOptions = {
                to: (to != 'self') ? to : config.SMTP.authUser,
                from: config.SMTP.authUser,
                subject: subject,
                html: message
            };
            if (attachments && attachments.length)
                mailOptions['attachments'] = attachments;
            smtpTransport.sendMail(mailOptions, (err, res) => {
                if (err) {
                    console.log('err', err);
                    return reject(err);
                } else {
                    return resolve(res)
                }
            });
        } else {
            return reject(constants.NOT_PROPER_DATA);
        }
    })
}
