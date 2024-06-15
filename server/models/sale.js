'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.SalesDetail, {
        foreignKey: 'SalesId'
      })
    }
  }
  Sale.init({
    TrxId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    table: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please Input a Table'
        },
        notNull: {
          msg: 'Please Input a Table'
        }
      }
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Transaction Amount Error'
        },
        notNull: {
          msg: 'Transaction Amount Error'
        }
      }
    },
    docStatus: {
      type: DataTypes.ENUM(['Draft', 'On Process', 'Posted']),
      defaultValue: 'Draft'
    },
    cashier: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Sale',
  });
  return Sale;
};