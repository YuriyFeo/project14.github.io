class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

const mongoose = require('mongoose');
const cardModel = require('../models/card.js');

const { ObjectId } = mongoose.Types;

// возвращает все карточки
module.exports.getCards = (req, res) => {
  cardModel.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// создаёт карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  cardModel.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => ((err.name === 'ValidationError') ? res.status(400).send({ message: 'Ошибка валидации' }) : res.status(500).send({ message: 'Произошла ошибка' })));
};


//  удаляет карточку по идентификатору
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  if (!ObjectId.isValid(cardId)) {
    res.status(400).send({ message: 'Невалидный id' });
    return;
  }
  cardModel.findById(cardId)
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        res.status(403).send({ message: 'Отсутствует доступ' });
      } else {
        cardModel.findByIdAndRemove(cardId)
          .then(() => res.status(200).send({ data: card }));
      }
    })
    .catch((err) => res.status(err.statusCode || 500).send({ message: 'Что-то пошло не так' }));
};
