const cardModel = require('../models/card.js');

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
  cardModel.findById(cardId)
    .then((card) => {
      if (card) {
        if (card.owner.equals(ownerId)) {
          cardModel.findByIdAndRemove(cardId)
            .then((cardRemove) => res.send({ remove: cardRemove }))
            .catch((err) => res.status(500).send({ message: err }));
        } else {
          res.status(403).send({ message: 'Это не ваша карта' });
        }
      } else {
        res.status(404).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => res.status(404).send({ message: err.message }));
};
