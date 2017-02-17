'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    path = require('path'),
    config = require(path.resolve('./config/config')),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User'),
    nodemailer = require('nodemailer'),
    crypto = require('crypto'),
    async = require('async'),
    crypto = require('crypto');

var errorHandler = require(path.resolve('./config/lib/errors')),
    UserError = errorHandler.UserError;
var mailer = require(path.resolve('./config/lib/mailer'));
var thenify = require('thenify');

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function(req, res, next) {
    var token, user;

    Promise
        .resolve(crypto.randomBytes(20).toString('hex'))
        .then((_token) => {
            token = _token;

            // Find a user
            if (req.body.username) {
                return User
                    .findOne({
                        username: req.body.username,
                        state: 'active'
                    })
                    .select('-salt -password')
                    .exec();
            }
            else if (req.body.email) {
                return User
                    .findOne({
                        email: req.body.email,
                        state: 'active'
                    })
                    .select('-salt -password')
                    .exec();
            }
            else {
                throw new UserError('username or email required');
            }
        })
        .then((_user) => {
            user = _user;
            
            // Set the token
            if (!user) {
                throw new UserError('No active account has been found');
            } else if (user.provider !== 'local') {
                throw new UserError('It seems like you signed up using your ' + user.provider + ' account');
            } else {
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                return user.save();
            }
        })
        .then(() => {
            // Send reset email
            return thenify(res.render).call(res,path.resolve('modules/users/server/templates/reset-password-email'), {
                name: user.displayName,
                appName: config.app.title,
                url: 'http://' + req.headers.host + '/api/auth/reset/' + token
            })
            .then((emailHTML) => {
                var mailOptions = {
                    to: user.email,
                    from: config.mailer.from,
                    subject: 'Password Reset',
                    html: emailHTML
                };
                return mailer.sendMail(mailOptions);
            });
        })
        .then(() => {
            res.send({
                message: 'An email has been sent with further instructions.'
            });
        })
        .catch((err) => {
            if (err instanceof UserError) {
                res.status(400).send({message: err.message});
            }
            else {
                next(err);
            }
        });
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function(req, res) {
	User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: {
			$gt: Date.now()
		},
		state: 'active'
	}, function(err, user) {
		if (!user) {
			return res.redirect('/#!/password/reset/invalid');
		}

		res.redirect('/#!/password/reset/' + req.params.token + '?username=' + user.username);
	});
};

/**
 * Reset password POST from email token
 */
exports.reset = function(req, res, next) {
	// Init Variables
	var passwordDetails = req.body;
	var message = null;

	async.waterfall([

		function(done) {
			User.findOne({
				resetPasswordToken: req.params.token,
				resetPasswordExpires: {
					$gt: Date.now()
				},
				state: 'active'
			}, function(err, user) {
				if (!err && user) {
					if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
						user.password = passwordDetails.newPassword;
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires = undefined;
						
						if (passwordDetails.username) {
						    user.username = passwordDetails.username;
						}

						user.save(function(err) {
							if (err) {
								return res.status(400).send({
									message: errorHandler.getErrorMessage(err)
								});
							} else {
								req.login(user, function(err) {
									if (err) {
										res.status(400).send(err);
									} else {
										// Return authenticated user 
										res.json(user);

										done(err, user);
									}
								});
							}
						});
					} else {
						return res.status(400).send({
							message: 'Passwords do not match'
						});
					}
				} else {
					return res.status(400).send({
						message: 'Password reset token is invalid or has expired.'
					});
				}
			});
		},
		function(user, done) {
			res.render('modules/users/server/templates/reset-password-confirm-email', {
				name: user.displayName,
				appName: config.app.title
			}, function(err, emailHTML) {
				done(err, emailHTML, user);
			});
		},
		// If valid email, send reset email using service
		function(emailHTML, user, done) {
			var smtpTransport = nodemailer.createTransport(config.mailer.options);
			var mailOptions = {
				to: user.email,
				from: config.mailer.from,
				subject: 'Your password has been changed',
				html: emailHTML
			};
			
			smtpTransport.sendMail(mailOptions, function(err) {
				done(err, 'done');
			});
		}
	], function(err) {
		if (err) return next(err);
	});
};

/**
 * Change Password
 */
exports.changePassword = function(req, res, next) {
	// Init Variables
	var passwordDetails = req.body;
	var message = null;

	if (req.user) {
		if (passwordDetails.newPassword) {
			User.findById(req.user.id, function(err, user) {
				if (!err && user) {
					if (user.authenticate(passwordDetails.currentPassword)) {
						if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
							user.password = passwordDetails.newPassword;

							user.save(function(err) {
								if (err) {
									return res.status(400).send({
										message: errorHandler.getErrorMessage(err)
									});
								} else {
									req.login(user, function(err) {
										if (err) {
											res.status(400).send(err);
										} else {
											res.send({
												message: 'Password changed successfully'
											});
										}
									});
								}
							});
						} else {
							res.status(400).send({
								message: 'Passwords do not match'
							});
						}
					} else {
						res.status(400).send({
							message: 'Current password is incorrect'
						});
					}
				} else {
					res.status(400).send({
						message: 'User is not found'
					});
				}
			});
		} else {
			res.status(400).send({
				message: 'Please provide a new password'
			});
		}
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};
