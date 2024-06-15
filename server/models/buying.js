'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Buying extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.BuyingDetail, {
        foreignKey: 'ExpenseId'
      })
    }
  }
  Buying.init({
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Buying Date is required'
        },
        notNull: {
          msg: 'Buying Date is required'
        }
      }
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Buying Amount is required'
        },
        notNull: {
          msg: 'Buying Amount is required'
        }
      }
    },
    docStatus: {
      type: DataTypes.ENUM(['Draft', 'On Process', 'Posted']),
      defaultValue: 'Draft'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postedBy: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'Buying',
  });
  return Buying;
};