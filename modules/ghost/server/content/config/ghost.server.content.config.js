// # Ghost Configuration
// Setup your Ghost install for various environments
// Documentation can be found at http://support.ghost.org/config/

var path = require('path'),
    appConfig = require(path.resolve('./config/config')),
    moduleConfig = appConfig.modules.ghost;

var config = {
    // ### Production
    // When running Ghost in the wild, use the production environment
    // Configure your URL and mail settings here
    production: {
        url: 'http://' + appConfig.externalAddress + moduleConfig.subdir,
        mail: {},

        database: {
            client: 'mysql',
            connection: {
                host     : moduleConfig.mysqlAddress,
                user     : 'root',
                password : 'complexlanyard',
                database : 'ghost_prod',
                charset  : 'utf8'
            }
        },

        server: {
            // Host to be passed to node's `net.Server#listen()`
            host: '0.0.0.0',
            // Port to be passed to node's `net.Server#listen()`, for iisnode set this to `process.env.PORT`
            port: '2368'
        },
        
        paths: {
            contentPath: path.join(__dirname, '/../'),
            subdir: moduleConfig.subdir
        }
    },
    
    // ### Stage
    // When running Ghost in the wild, use the production environment
    // Configure your URL and mail settings here
    stage: {
        url: 'http://' + appConfig.externalAddress + moduleConfig.subdir,
        mail: {},
        
        database: {
            client: 'mysql',
            connection: {
                host     : moduleConfig.mysqlAddress,
                user     : 'root',
                password : 'complexlanyard',
                database : 'ghost_stage',
                charset  : 'utf8'
            }
        },

        server: {
            // Host to be passed to node's `net.Server#listen()`
            host: '0.0.0.0',
            // Port to be passed to node's `net.Server#listen()`, for iisnode set this to `process.env.PORT`
            port: '2368'
        },
        
        paths: {
            contentPath: path.join(__dirname, '/../'),
            subdir: moduleConfig.subdir
        }
    },

    // ### Development **(default)**
    development: {
        // The url to use when providing links to the site, E.g. in RSS and email.
        // Change this to your Ghost blogs published URL.
        url: 'http://localhost:2368' + moduleConfig.subdir,

        // Example mail config
        // Visit http://support.ghost.org/mail for instructions
        // ```
        //  mail: {
        //      transport: 'SMTP',
        //      options: {
        //          service: 'Mailgun',
        //          auth: {
        //              user: '', // mailgun username
        //              pass: ''  // mailgun password
        //          }
        //      }
        //  },
        // ```

        database: {
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, '/../data/ghost-dev.db')
            },
            debug: false
        },
        server: {
            // Host to be passed to node's `net.Server#listen()`
            host: '0.0.0.0',
            // Port to be passed to node's `net.Server#listen()`, for iisnode set this to `process.env.PORT`
            port: 2368
        },
        paths: {
            contentPath: path.join(__dirname, '/../'),
            subdir: moduleConfig.subdir
        }
    },

    // **Developers only need to edit below here**

    // ### Testing
    // Used when developing Ghost to run tests and check the health of Ghost
    // Uses a different port number
    test: {
        url: 'http://127.0.0.1:2369',
        database: {
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, '/../data/ghost-test.db')
            }
        },
        server: {
            host: '127.0.0.1',
            port: '2369'
        },
        paths: {
            contentPath: path.join(__dirname, '/../'),
        },
        logging: false
    },

    // ### Testing MySQL
    // Used by Travis - Automated testing run through GitHub
    'testing-mysql': {
        url: 'http://127.0.0.1:2369',
        database: {
            client: 'mysql',
            connection: {
                host     : '127.0.0.1',
                user     : 'root',
                password : '',
                database : 'ghost_testing',
                charset  : 'utf8'
            }
        },
        server: {
            host: '127.0.0.1',
            port: '2369'
        },
        logging: false
    },

    // ### Testing pg
    // Used by Travis - Automated testing run through GitHub
    'testing-pg': {
        url: 'http://127.0.0.1:2369',
        database: {
            client: 'pg',
            connection: {
                host     : '127.0.0.1',
                user     : 'postgres',
                password : '',
                database : 'ghost_testing',
                charset  : 'utf8'
            }
        },
        server: {
            host: '127.0.0.1',
            port: '2369'
        },
        logging: false
    }
};

// Export config
module.exports = config;
