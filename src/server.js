const createApp = require('./app');
const config = require('./config/config');
const logging = require('./config/logging');
const database = require('./database/database');
const NAMESPACE = 'Server';

app = createApp(database);

/** Actual Server start */
app.listen(config.server.port, () => logging.info(NAMESPACE, `Server running on ${config.server.hostname}:${config.server.port}`));
