// подключаем модуль mongoose для работы с базой данных
const mongoose = require('mongoose');
// подключаем модуль validator для валидации email и avatar
// const validator = require('validator');
// полключаем модуль bcryptjs для хеширования
const bcrypt = require('bcryptjs');

const isEmail = require('validator/lib/isEmail');
const isURL = require('validator/lib/isURL');

// Опишем схему:
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильный формат URL',
      // validator: (v) => validator.isURL(v),
      // message: (props) => `${props.value} Неверный URL!`,
    },
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
      /* validator: (value) => validator.isEmail(value), */
    },
  },
  password: {
    required: true,
    type: String,
    select: false,
    minlength: 8,
  },
});


userSchema.statics.findUserByCredentials = function fun(email, password) {
  // попытка найти пользователя по email
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // сравниваем полученный и сохраненный в базе хеши (возвращает true или false)
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          // хеши не совпали — отклоняем промис
          if (!matched) {
            throw Promise.reject(new Error('Неправильные почта или пароль'));
          }
          // аутентификация успешна
          return user;
        });
    })
    .catch((error) => error);
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
