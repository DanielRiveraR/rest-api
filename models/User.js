'use strict';

const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);


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
        validate: {
            notNull: {
                msg: 'Please provide your first name.'
            },
            notEmpty: {
                msg: 'Please provide your first name.'
            }
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Please provide your last name.'
            },
            notEmpty: {
                msg: 'Please provide your last name.'
            }
        }
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'The email that you entered already exist in our database.'
        },
        validate: {
            notNull: {
                msg: 'Please provide an email address.'
            },
            notEmpty: {
                msg: 'Please provide an email address.'
            },
            isEmail: {
                args: true,
                msg: 'You need to provide a valid email address.'
            }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Please provide a password.'
            },
            notEmpty: {
                msg: 'Please provide a password.'
            },
            len: {
                args: [8, 20],
                msg: 'Your password should have between 8 and 20 characters long.'
            },
            set(val) {
                if(val === this.password) {
                    const hashedPassword = bcrypt.hashSync(this.password, salt);
                    this.setDataValue('password', hashedPassword);
                }
            }
        }
      },

    }, { sequelize });
  
    User.associate = (models) => {
        User.hasMany(models.Course, { 
            as: 'Enrolled',
            foreignKey: {
               fieldName: 'userId',
            }
        });
    };
  
    return User;
  };