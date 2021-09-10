const jwt = require('jsonwebtoken');
const config = require('../config/config');
const verifyToken = (req, res, next) => {
    // get auth header
    const bearerHeader = req.headers['authorization'];
    // Check if bearer
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        bearerToken;

        const verifyOptions = {
            algorithms: ['RS256']
        };

        jwt.verify(bearerToken, config.keys.public, verifyOptions, (error, decoded) => {
            // we keep the decoded argument in case we need it later
            if (error) {
                error.status = 403;
                error.message = 'Access Token is invalid.';
                throw error;
            } else {
                next();
            }
        });
    } else {
        // forbidden
        // throw the error to be caught by error handling middleware
        const error = new Error('Endpoint forbidden. Missing Authorization header.');
        error.status = 401;
        throw error;
    }
};

module.exports = {
    verifyToken
};
