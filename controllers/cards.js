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
      if (card.owner.equals(ownerId) /* card.owner.toString() === ownerId */) {
        cardModel.findByIdAndRemove(cardId)
          .then((card) => res.send({ data: card }))
          .catch(() => errorSend(res));
      } else {
        return res.status(500).send({ message: 'Вы не имеете доступ к удалению чужих карточек' });
      }
    })
    .catch(() => res.status(500).send({ message: 'Не найден объект с таким идентификатором' }));
};
