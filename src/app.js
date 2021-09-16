const express = require('express');
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
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'GET POST');
            return res.status(200).json({});
        }

        next();
    });

    app.get('/', (req, res) => {
        const error = new Error('Test error');
        error.status = 469;
        throw error;
    });

    /** Routes */
    app.use('/api/user', userRoutes(database));

    /** Error handling */

    // 404
    app.use((req, res, next) => {
        const error = new Error('Error 404 Not Found');
        error.status = 404;
        next(error);
    });

    // anything else
    app.use((error, req, res, next) => {
        res.status(error.status || 500);

        res.json({
            message: error.message,
            error: error
        });
    });

    return app;
};

module.exports = createApp;
