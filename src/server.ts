import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import logging from './config/logging';
import config from './config/config';

// route import
import sampleRoutes from './routes/sample';
//import keyRoutes from './r'

const NAMESPACE = 'Server';
const app = express();

/** connect to mongo db */

// dont connect to mongo if dot env doesn't exist
if (config.mongo.host != 'none') {
    mongoose
        .connect(config.mongo.url, config.mongo.options)
        .then((result) => {
            logging.info(NAMESPACE, 'Mongo Connected');
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);
        });
}

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
app.use('/sample', sampleRoutes);

/** Error handling */
app.use((req, res, next) => {
    const error = new Error('Not found');

    return res.status(404).json({
        message: error.message
    });
});

/** Server */

app.listen(config.server.port, () => logging.info(NAMESPACE, `Server running on ${config.server.hostname}:${config.server.port}`));
