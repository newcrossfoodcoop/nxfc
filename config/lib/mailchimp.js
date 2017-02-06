'use strict';

var Mailchimp = require('mailchimp-api-v3');
var md5 = require('md5');
var path = require('path');

var config = require(path.resolve('./config/config'));
 
var mailchimp = null;

if (config.mailchimp.apiKey === 'MAILCHIMP_API_KEY') {
    console.error('MAILCHIMP_API_KEY not set');
}
else {
    mailchimp = new Mailchimp(config.mailchimp.apiKey);
}

exports.put = function(user, email) {
    if (!mailchimp) {
        return Promise.resolve(true);
    }
    
    var email_hash = md5(email.toLowerCase());

    return mailchimp.request({
        method: 'put',
        path: '/lists/{list_id}/members/{subscriber_hash}',
        path_params: {
            list_id: config.mailchimp.list,
            subscriber_hash: email_hash
        },
        body: {
            status: (user.newsletter ? 'subscribed' : 'unsubscribed'),
            status_if_new: (user.newsletter ? 'subscribed' : 'unsubscribed'),
            email_address: user.email,
            merge_fields: {
                FNAME: user.firstName,
                LNAME: user.lastName,
                ID: user._id,
                EMAIL: user.email
            }
        }
    });
};
