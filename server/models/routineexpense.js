'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoutineExpense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.ExpenseType, {
        foreignKey: 'TypeId'
      })
    }
  }
  RoutineExpense.init({
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Expense Date is required'
        },
        notEmpty: {
          msg: 'Expense Date is required'
        }
      }
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Expense Amount is required'
        },
        notEmpty: {
          msg: 'Expense Amount is required'
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
    TypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Expense Type is required'
        },
        notEmpty: {
          msg: 'Expense Type is required'
        }
      }
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
    modelName: 'RoutineExpense',
  });
  return RoutineExpense;
};