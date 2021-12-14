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
        validate: {
            notNull: {
                msg: 'Please provide a title for the course.'
            },
            notEmpty: {
                msg: 'Please provide a title for the course.'
            }
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Please provide a description for the course.'
            },
            notEmpty: {
                msg: 'Please provide a descrition for the course.'
            }
        }
      },
      estimatedTime: {
        type: DataTypes.STRING,
      },
      materialsNeeded: {
        type: DataTypes.STRING,
      },
    }, { sequelize });
  
    Course.associate = (models) => {
        Course.belongsTo(models.User, { 
            as: 'Owner',
            foreignKey: {
               fieldName: 'userId',
            }
        });
    };
  
    return Course;
  };
