const express = require('express');
const router = express.Router();
const sequelize = require("./models").sequelize;

sequelize.sync().then(() => {
    express.listen(3000, () => console.log(`The site is running at localhost:${3000}`));
  });