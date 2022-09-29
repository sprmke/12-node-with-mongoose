const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = requrie('mongoose');

const dotenv = require('dotenv');

const errorController = require('./controllers/error');
const User = require('./models/user');

dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // Temporary do this:
  // to save this userId on products collection
  User.findById('632bef750415689a6e4bbf06')
    .then((user) => {
      const { name, email, cart, _id } = user;
      req.user = new User(name, email, cart, _id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then((result) => {
    app.listen(300);
  })
  .catch((error) => console.log(error));
