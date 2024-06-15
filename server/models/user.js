'use strict';
const { hash } = require('../helpers/bcrypt')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.AuthModule, {
        foreignKey: 'UserId'
      })
      this.hasOne(models.Employment, {
        foreignKey: 'UserId'
      })
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Username is already used'
      },
      validate: {
        notEmpty: {
          msg: 'Username is required'
        },
        notNull: {
          msg: 'Username is required'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password is required'
        },
        notNull: {
          msg: 'Password is required'
        }
      }
    },
    role: {
      type: DataTypes.ENUM(['User', 'Administrator']),
      defaultValue: 'User',
    },
    newUser: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((user) => {
    user.password = hash(user.password)
  })

  return User;
};