'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Config extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
    }
  }
  Config.init({
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'This config already exists'
      },
      validate: {
        notEmpty: {
          msg: 'Config key is required'
        },
        notNull: {
          msg: 'Config key is required'
        }
      }
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Config key is required'
        },
        notNull: {
          msg: 'Config key is required'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Config',
    timestamps: false,
  });
  return Config;
};