'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.MenuIngredient, {
        foreignKey: 'MenuId'
      })
    }
  }
  Menu.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Menu already exists'
      },
      validate: {
        notEmpty: {
          msg: 'Menu Name is required'
        },
        notNull: {
          msg: 'Menu Name is required'
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Menu Price is required'
        },
        notNull: {
          msg: 'Menu Price is required'
        }
      }
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Menu',
  });
  return Menu;
};