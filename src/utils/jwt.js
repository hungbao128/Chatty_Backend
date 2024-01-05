const jwt = require('jsonwebtoken');

const generateToken = ({
    payload, 
    secretKey,
    options
}) => {
    return new Promise((reslove, reject) => {
        jwt.sign(payload, secretKey, options, (err, token) => {
            if(err) return reject(err);

            reslove(token);
        });
    })    
}

const verifyToken = ({
    token,
    secretKey
}) => {
    return new Promise((reslove, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            if(err) return reject(err);

            reslove(decoded);
        });
    })    
}

module.exports = {
    generateToken,
    verifyToken
}