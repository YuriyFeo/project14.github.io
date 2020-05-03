const mongoose = require('mongoose');
const userModel = require('../models/user.js');

const { ObjectId } = mongoose.Types;

// возвращает пользователя
module.exports.getUsers = (req, res) => {
  userModel.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// находит пользователя по id
module.exports.findUser = (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).send({ message: 'Невалидный id' });
    return;
  }
  userModel.findById({ _id: id })
    .then((user) => (user ? res.status(200).send({ data: user }) : res.status(404).send({ message: 'Нет пользователя с таким id' })))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// создает пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userModel.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => ((err.name === 'ValidationError') ? res.status(400).send({ message: 'Ошибка валидации' }) : res.status(500).send({ message: 'Произошла ошибка' })));
};
