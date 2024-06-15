'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SalesDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Sale, {
        foreignKey: 'SalesId'
      })
    }
  }
  SalesDetail.init({
    menuName: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Order Quantity is required'
        },
        notNull: {
          msg: 'Order Quantity is required'
        }
      }
    },
    SalesId: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'SalesDetail',
    timestamps: false,
  });
  return SalesDetail;
};