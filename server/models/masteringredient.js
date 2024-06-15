'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MasterIngredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.MenuIngredient, {
        foreignKey: 'IngredientId',
        as: 'Ingredients'
      })
    }
  }
  MasterIngredient.init({
    ingredientName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Ingredient already exists'
      },
      validate: {
        notEmpty: {
          msg: 'Ingredient Name is required'
        },
        notNull: {
          msg: 'Ingredient Name is required'
        }
      }
    },
    unit: {
      type: DataTypes.ENUM(['Kilogram', 'Gram', 'Onz', 'Piece']),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Unit of Measurement is required'
        },
        notNull: {
          msg: 'Unit of Measurement is required'
        }
      }
    },
    updatedBy: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'MasterIngredient',
    timestamps: false
  });
  return MasterIngredient;
};