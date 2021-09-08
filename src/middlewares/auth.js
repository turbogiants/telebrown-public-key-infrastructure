const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    // get auth header
    const bearerHeader = req.headers['authorization'];
    // Check if bearer
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        req.token = bearerToken;
        next();
    } else {
        // forbidden
        res.status(403).json({ message: 'Endpoint forbidden. Missing Authorization header.' });
    }
};

module.exports = {
    verifyToken
};
