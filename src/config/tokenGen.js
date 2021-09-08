/** This file is purely for generating Access Tokens
 *  This file needs RSA keys in the keys/ directory
 *  Simply run the file to generate an access token
 */

const jwt = require('jsonwebtoken');
const config = require('./config');

const signOptions = {
    algorithm: 'RS256'
};

const token = jwt.sign({}, config.keys.private, signOptions);

console.log(token);
