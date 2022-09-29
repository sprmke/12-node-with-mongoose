const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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
  // Save this user on request to be used across the app
  User.findById('63356f01efbebf8041014a90')
    .then((user) => {
      req.user = user;
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
    // get the first user
    User.findOne().then((user) => {
      // if we don't have any user, create one
      if (!user) {
        const user = new User({
          name: 'Mike',
          email: 'mike@test.com',
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((error) => console.log(error));
