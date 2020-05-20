/*const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
    const token = req.cookies.jwt;
    let payload;

    try {
        payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    } catch (err) {
        return res
            .status(401)
            .send({ message: 'Необходима авторизация' });
    }
    req.user = payload;

    return next();
};*/

const jwt = require('jsonwebtoken');
const Error401 = require('../errors/err401');
const { NODE_ENV, JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).send({ message: 'Необходимо авторизоваться!' });
    }
    let payload;

    try {
        payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    } catch (err) {

        return next(new Error401('Необходимо авторизоваться'));
    }
    // req.user = payload;
    req.user = payload;

    next();
};