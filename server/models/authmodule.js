'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AuthModule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'UserId'
      })
    }
  }
  AuthModule.init({
    authorization: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'AuthModules Error. Contact Administrator'
        },
        notNull: {
          msg: 'AuthModules Error. Contact Administrator'
        }
      },
    },
    value: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'AuthModules Error. Contact Administrator'
        },
        notNull: {
          msg: 'AuthModules Error. Contact Administrator'
        }
      },
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'AuthModule',
    timestamps: false
  });
  return AuthModule;
};