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
        .catch((err) => res.status(404).send({ message: err.message }));
};

//  удаляет карточку по идентификатору
module.exports.deleteCard = (req, res) => {
    card.findById(req.params.id)
        .then((cardWithId) => {
            const { owner } = cardWithId;
            return owner;
        })
        .then((owner) => {
            if (req.user._id === owner.toString()) {
                return card.findByIdAndRemove(req.params.id);
            }
            return Promise.reject(new Error('Чтобы удалить карточку,вам необходимо быть её владельцем.'));
        })
        .then((user) => {
            if (user) {
                res.send({ data: user });
            } else {
                res.status(400).send({ message: `Карточки с id: ${req.params.id} не существует` });
                console.error();
            }
        })
        .catch((err) => {
            if (err) {
                res.status(400)
                    .send({ message: 'Чтобы удалить карточку,вам необходимо быть её владельцем.' });
                console.error(err.stack);
            }
        });
};