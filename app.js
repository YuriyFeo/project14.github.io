const express = require('express');
const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { PORT, DATABASE_URL } = require('./config');
const users = require('./routes/users.js');
const cards = require('./routes/cards.js');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');


const app = express();

app.use(cookieParser());

// подключаемся к серверу mongo
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// подключаем мидлвары, роуты
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, users);
app.use('/cards', auth, cards);

app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  let { message } = err.message;
  if (status === 500) {
    message = 'Что-то пошло не так';
  }
  res.status(status).send({ message });
});

// слушаем ответ сервера
app.listen(PORT);
