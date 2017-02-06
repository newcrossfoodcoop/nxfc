'use strict';

var nodemailer = require('nodemailer');
var thenify = require('thenify');
var util = require('util');
var path = require('path');

var config = require(path.resolve('./config/config'));

exports.sendMail = function (mailOptions) {
    var emailHTML = mailOptions.html;

    if (config.mailer.from === 'MAILER_FROM') {
        console.log('MAILER_FROM not defined: Account Activation not sent\n' + emailHTML);
        return;
    }
    
    if (!mailOptions.from) {
        mailOptions.from = config.mailer.from;
    }
    
    var smtpTransport = nodemailer.createTransport(config.mailer.options);
    
    return thenify(smtpTransport.sendMail)
        .call(smtpTransport,mailOptions)
        .then(() => {
            console.log(util.format('Email "%s" sent', mailOptions.subject));
        });
};
