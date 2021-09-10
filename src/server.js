const createApp = require('./app');
const config = require('./config/config');
const database = require('./database/database');
const https = require('https');

const logging = require('./config/logging');
const NAMESPACE = 'Server';

const app = createApp(database);

const sslServer = https.createServer(
    {
        key: config.cert.key,
        cert: config.cert.cert
    },
    app
);

/** Actual Server start */
// app.listen(config.server.port, () => {
//     logging.info(NAMESPACE, `Server running on ${config.server.hostname}:${config.server.port}`);
// });

sslServer.listen(config.server.port, () => {
    logging.info(NAMESPACE, `Server running on ${config.server.hostname}:${config.server.port}`);
});
