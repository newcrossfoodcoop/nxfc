'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema, 
	util = require('util');

/**
 * ingest log Schema
 */
var ingestLogSchema = new Schema({
    ingest: {
		type: Schema.ObjectId,
		ref: 'Ingest',
		required: 'An ingest log must be associated with an ingest'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	updated: {
	    type: Date,
	    default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	},
	logEntities: {
	    type: [{
	        date: { type: Date, default: Date.now },
	        message: String
	    }],
	    default: [] 
	},
	status: {
	    type: String,
	    enum: ['new', 'running', 'success', 'fail'],
	    default: 'new',
	    required: 'ingest log must have a status'
	}
});

ingestLogSchema.methods.log = function() {
    var message = util.format.apply(this,arguments);
    this.logEntities.push({message: message});
    this.status = 'running';
    console.log(message);
    return message;
};

ingestLogSchema.methods.finish = function(err) {
    if (err) {
        this.log('finished with error: %s', err);
        this.status = 'fail';
    }
    else {
        this.log('finished');
        this.status = 'success';
    }
};

mongoose.model('IngestLog', ingestLogSchema);
