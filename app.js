const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { PORT, DATABASE_URL } = require('./config.js');
const users = require('./routes/users.js');
const cards = require('./routes/cards.js');

// const { PORT = 3000 } = process.env;
const app = express();


// подключаемся к серверу mongo
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Реализуйте временное решение авторизации

app.use((req, res, next) => {
  req.user = {
    _id: '5e9ca7a7269ccfd5619e98b5',
  };

  next();
});


// подключаем мидлвары, роуты
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', users);
app.use('/cards', cards);
app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

// слушаем ответ сервера
app.listen(PORT);
