'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExpenseType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.RoutineExpense, {
        foreignKey: 'TypeId'
      })
    }
  }
  ExpenseType.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Expense Name is required'
        },
        notNull: {
          msg: 'Expense Name is required'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'ExpenseType',
    timestamps: false
  });
  return ExpenseType;
};