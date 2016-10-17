'use strict';

var util = require('util'),
    mongoose = require('mongoose'),
    Payment = mongoose.model('Payment'),
    Order = mongoose.model('Order'),
    async = require('async'),
    _ = require('lodash');

module.exports = function(app) {
    var checkout = require('./plugins')(app),
        config = app.locals.ecom;

    exports.start = function(req, res) {
        
        var order = new Order(req.body);
	    order.user = req.user;
	    
	    console.log(order);
	
	    // orders can only be created in the new state and modifications are
	    // managed through contoller methods (no bare updates)
        order.state = 'new'; 

        var subController = checkout.getSubController(req.params.method);
        
        async.waterfall([
            function(callback) {
                order.save(callback);
            },
            function(_order,n,callback) {
                order = _order;
                subController.initiatePayment(order, callback);
            },
            function(data, callback){
                var payment = new Payment({ 
                    user: req.user,
                    method: req.body.method
                });
                order.payments.push(payment);
                payment.orderId = order._id;
                payment.recordTransaction('initial', data, callback);
            },
            function(payment,n,callback) {
                order.state = 'submitted';
                order.save(callback);
            },
            function(order,n,callback) {
                order.populate('payments',callback);
            }
        ],
        function(err,order) {
            if (err) {
                console.error(err);
                return res.status(400).send(err);
            }
            res.jsonp({ redirect: subController.approvalRedirectUrl(order) });
        });
    };

    function checkState(order, thisState, prevState, callback) {
        var prevStates = typeof prevState === 'object' ? prevState : [prevState];
        
        if (order.state === thisState) {
            callback(new Error('no state change'),order);
        }
        else if (!_.intersection([order.state], prevStates).length) {
            callback(new Error(util.format(
                'invalid state transition %s -> %s', order.state, thisState
            )));
        }
        
        callback();
    }

    exports.redirected = function(req, res) {
        var order = req.order ;
        
        var subController = checkout.getSubController(req.params.method);
        
        async.waterfall([
            function(callback) {
                checkState(order,'gotdetails',['submitted','redirected'],callback);
            },
            function(callback) {
                var payment = order.getPayment();
                payment.recordTransaction('info', req.body);
                payment.save(callback);
            },
            function(_payment,n,callback) {
                order.state = 'redirected';
                order.save(callback);
            },
            function(_order,n,callback) {
                order = _order;
                subController.getPaymentDetails(order,callback);
            },
            function(data, callback) {
                order.getPayment().recordTransaction('details', data, callback);
            },
            function(_payment,n,callback) {
                order.state = 'gotdetails';
                order.save(callback);
            }
        ],
        function(err,result) {
            if (err) { console.error(err); }
            if (result) { return res.jsonp(result); }
            return res.send(400, err);
        });
    };

    exports.confirm = function(req, res) {
        var order = req.order;

        var subController = checkout.getSubController(req.params.method);

        async.waterfall([
            function(callback) {
                checkState(order,'confirmed','gotdetails',callback);
            },
            function(callback) {
                subController.capturePayment(order,callback);
                console.log('capturePayment started');
            },
            function(data,callback) {
                order.getPayment().recordTransaction('confirmation',data,callback);
                console.log('record transaction started');
            },
            function(_payment,n,callback) {
                order.state = 'confirmed';
                order.save(callback);
                console.log('order save started');
            }
        ],
        function(err,result) {
            if (err) { console.error(err); }
            if (result) { return res.jsonp(result); }
            return res.send(400, err);
        });
    };

    exports.cancelled = function(req, res) {
        var order = req.order ;
        
        async.waterfall([
            function(callback) {
                checkState(order,'cancelled','submitted',callback);
            },
            function(callback) {
                order.getPayment().recordTransaction(
                    'cancelled',
                    { date: Date.now, token: req.body.token },
                    callback
                );
            },
            function(_payment,n,callback) {
                order.state = 'cancelled';
                order.save(callback);
            }
        ],
        function(err,result) {
            if (err) { console.error(err); }
            if (result) { return res.jsonp(result); }
            return res.send(400, err);
        });
    };

    exports.orderByID = function(req, res, next, id) {
        var subController = checkout.getSubController(req.params.method);
        var populateArgs = subController.populatePaymentsArgs(req, req.params.token);
        if (! populateArgs) return next(new Error('populateArgs not set'));
        Order
            .findById(id)
            .where({state: { $ne: 'deleted' }})
            .populate('user', 'displayName')
            .populate(populateArgs)
            .exec(function(err, order) {
		        if (err) return next(err);
		        if (! order) return next(new Error('Failed to load Order ' + id));
		        if (subController.rejectToken(order,req,req.params.token)) return next(new Error('token mismatch'));
		        req.order = order;
		        next();
	        });
    };

    exports.config = function(req, res, next) {
        res.jsonp({
            active: checkout.getActive()
        });
    };   
    
    return exports;
};
