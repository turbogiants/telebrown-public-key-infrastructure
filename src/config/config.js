const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

// mongo db config
const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    poolSize: 50,
    autoIndex: false,
    retryWrites: false
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || 'none';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'none';
const MONGO_HOST = process.env.MONGO_URL || 'none';

const MONGO = {
    host: MONGO_HOST,
    password: MONGO_PASSWORD,
    username: MONGO_USERNAME,
    options: MONGO_OPTIONS,
    url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`
};

// server config
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 8080;

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};

// keys & tokens
const KEYS = {
    private: fs.readFileSync(`${__dirname}/keys/private.key`, 'utf-8'),
    public: fs.readFileSync(`${__dirname}/keys/public.key`, 'utf-8'),
    access_token: process.env.ACCESS_TOKEN
};

const CERT = {
    key: fs.readFileSync(`${__dirname}\\cert\\key.pem`),
    cert: fs.readFileSync(`${__dirname}\\cert\\cert.pem`)
};

const config = {
    mongo: MONGO,
    server: SERVER,
    keys: KEYS,
    cert: CERT
};

module.exports = config;
