const mongoose = require('mongoose');
const cardModel = require('../models/card.js');

const { ObjectId } = mongoose.Types;
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbidError = require('../errors/forbid-error');

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
    .catch((err) => res.status(500).send({ message: err.message }));
};

//  удаляет карточку по идентификатору
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  const ownerId = req.user._id;

  if (!ObjectId.isValid(cardId)) {
    throw new BadRequestError('Невалидный id');
  }

  cardModel.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      return card.owner.equals(ownerId);
    })
    .then((isMatch) => {
      if (!isMatch) {
        throw new ForbidError('Невозможно удалить чужую карточку');
      }
      return cardModel.findByIdAndRemove(cardId);
    })
    .then((cardRemove) => {
      if (!cardRemove) {
        throw new ForbidError('Невозможно удалить чужую карточку');
      }
      res.send({ remove: cardRemove });
    })
    .catch((err) => res.status(err.statusCode).send({ message: err.message }));
};
