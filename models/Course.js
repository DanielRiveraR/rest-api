'use strict';

const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    class Course extends Model {}
    Course.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.Text,
        allowNull: false,
      },
      estimatedTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      materialsNeeded: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, { sequelize });
  
    Course.associate = (models) => {
        Course.belongsTo(models.User);
    };
  
    return Course;
  };
