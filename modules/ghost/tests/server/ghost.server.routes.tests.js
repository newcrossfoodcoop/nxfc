'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	express = require(path.resolve('./config/lib/express')),
	config = require(path.resolve('./config/config'));
/**
 * Globals
 */
var app, agent, credentials, user, ghostServer;

/**
 * Article routes tests
 */
describe('Ghost integration tests', function() {
	before(function(done) {
		this.timeout(6000);
        // Validate setup
        if (process.env.NODE_ENV !== 'test') {
            return done(new Error('NODE_ENV must be "test" for ghost tests'));
        }

		// Get application
		app = express.init(mongoose);
		agent = request.agent(app);

        // Start the ghost server
        config.modules.ghost.makeGhost().then(function(server) {
            ghostServer = server;
            server.start(app);
            done();
        });
	});
	
	after(function(done) {
	    ghostServer.stop().done(function() { done(); });
	});
	
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'ghostuser',
			password: 'password'
		};
		
		// Create a new user
		user = new User({
			firstName: 'Ghost',
			lastName: 'User',
			displayName: 'Ghost User',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local',
			roles: ['ghost-admin']
		});
        
		// Save a user to the test db
		user.save(done);
	});
	
	afterEach(function(done) {
		User.remove().exec(done);
	});
	
	it('should be possible to obtain ghost auth tokens with ghost roles', function(done) {
		this.timeout(6000);
	    agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) { return done(signinErr); }

				// Get the userId
				var userId = user.id;
				
				should.exist(signinRes.headers['set-cookie']);
				
				// Save a new article
				agent.get('/api/ghost/login')
				    .set('Cookie', signinRes.headers['set-cookie'])
				    .redirects(0)
					.expect(200)
					.end(function(err, res) {
					    if (err) { return done(err); }
					    done();
					});
		    });			
	});
});
