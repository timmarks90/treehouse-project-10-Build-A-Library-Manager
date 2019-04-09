'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Must have a value"
        }
      }
    }
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Must have a value"
        }
      }
    }
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {});
  Book.associate = function(models) {
    // associations can be defined here
  };
  return Book;
};