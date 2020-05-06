const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = require('../config.js');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок, токен из хедера
  const { authorization } = req.headers;
  // убеждаемся, что он есть и начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  // извлечём токен, вызовем метод replace, чтобы выкинуть из заголовка приставку 'Bearer '
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // проверку токена осуществляем методом verify
    // принимает на вход два параметра: токен и секретный ключ, которым этот токен был подписан
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    // отправим ошибку, если не получилось
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  // записываем пейлоуд в объект запроса
  req.user = payload;
  // пропускаем запрос дальше
  next();
};
