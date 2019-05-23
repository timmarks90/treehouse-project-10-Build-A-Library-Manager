const express = require('express');
const sequelize = require("./models").sequelize;
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use a static route and the express.static method to serve the static files located in the public folder
app.use("/static", express.static("public"));

// Load Pug into Express app - set view engine to pug
app.set('view engine', 'pug');

const mainRoutes = require('./routes/index');
const booksRoute = require('./routes/books');

app.use(mainRoutes);
app.use(booksRoute);

// 404 error page
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err); 
});

// 404 page styling
app.use((err, req, res, next) => {
  res.status(err.status);
  res.render('page-not-found', { err });
});

// Launch server on localhost:3000
sequelize.sync().then(() => {
    app.listen(3000, () => console.log(`The site is running at localhost:${3000}`));
  });