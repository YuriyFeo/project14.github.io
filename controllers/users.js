// const mongoose = require('mongoose');
// Для хеширования пароля модуль bcryptjs
const bcrypt = require('bcryptjs');
// Для создания токенов воспользуемся пакетом jsonwebtoken
const jwt = require('jsonwebtoken');
// импортируем схему
const userModel = require('../models/user.js');

const { NODE_ENV, JWT_SECRET } = require('../config');

// const { ObjectId } = mongoose.Types;

// возвращает пользователя
module.exports.getUsers = (req, res) => {
  userModel.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// находит пользователя по id
module.exports.findUser = (req, res) => {
  const { id } = req.params;
  userModel.findById({ _id: id })
    .then((user) => (user ? res.status(200).send({ data: user }) : res.status(404).send({ message: 'Нет пользователя с таким id' })))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// создает пользователя
module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;


  // хешируем пароль
  return bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.send({
      name,
      about,
      avatar,
      email,
    }))
    .catch(() => { res.status(500).send({ message: 'Произошла ошибка' }); });
};

// контроллер login, который получает из запроса почту и пароль и проверяет их
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      // создаем токен методом sign, передали два аргумента: _id и секретный ключ подписи
      // токен создается на 7 дней
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      // отправим токен, браузер сохранит его в куках
      res.cookie('jwt', token, {
        maxAge: 604800,
        httpOnly: true,
        sameSite: true,
        // secure: true,
      });
      res.send({ token });
    })
    .catch((err) => { res.status(401).send({ message: err.message }); });
};
