'use strict';

const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    class User extends Model {}
    User.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

    }, { sequelize });
  
    User.associate = (models) => {
        User.hasMany(models.Course);
    };
  
    return User;
  };