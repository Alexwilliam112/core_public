'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MenuIngredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.MasterIngredient, {
        foreignKey: 'IngredientId',
        as: 'Ingredients'
      })
      this.belongsTo(models.Menu, {
        foreignKey: 'MenuId'
      })
    }
  }
  MenuIngredient.init({
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Ingredient Quantity is required'
        },
        notNull: {
          msg: 'Ingredient Quantity is required'
        }
      }
    },
    MenuId: {
      type: DataTypes.INTEGER,
    },
    IngredientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Ingredient is required'
        },
        notNull: {
          msg: 'Ingredient is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'MenuIngredient',
    timestamps: false
  });
  return MenuIngredient;
};