const express = require('express');
const database = require('./database/database');
const logging = require('./config/logging');

const NAMESPACE = 'App';

/** Use a function to implement dependency injection for database */
const createApp = (database) => {
    // route import
    const userRoutes = require('./routes/userRoutes');
    const app = express();

    /** Logging the request */
    app.use((req, res, next) => {
        logging.info(NAMESPACE, `METHOD - [${req.method}] URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            logging.info(NAMESPACE, `METHOD - [${req.method}] URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`);
        });

        next();
    });

    /** Parse the request */
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    /** Rules of the API */
    app.use((req, res, next) => {
        // TODO: handle unauthorized access
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'GET POST');
            return res.status(200).json({});
        }

        next();
    });

    /** Routes */
    app.use('/api/debug', userRoutes(database));

    /** Error handling */
    app.use((req, res, next) => {
        const error = new Error('Not found lol');

        return res.status(404).json({
            message: error.message
        });
    });

    return app;
};

module.exports = createApp;
