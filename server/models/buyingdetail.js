'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BuyingDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Buying, {
        foreignKey: 'ExpenseId'
      })
    }
  }
  BuyingDetail.init({
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Item Quantity is required'
        },
        notNull: {
          msg: 'Item Quantity is required'
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Item Price is required'
        },
        notNull: {
          msg: 'Item Price is required'
        }
      }
    },
    ingredientName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Ingredient is required'
        },
        notNull: {
          msg: 'Ingredient is required'
        }
      }
    },
    unit: {
      type: DataTypes.ENUM(['Kilogram', 'Gram', 'Onz', 'Piece']),
    },
    ExpenseId: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'BuyingDetail',
    timestamps: false,
  });
  return BuyingDetail;
};