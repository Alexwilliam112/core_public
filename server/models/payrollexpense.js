'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PayrollExpense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.PayrollDetail, {
        foreignKey: 'PayId'
      })
    }
  }
  PayrollExpense.init({
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Payroll Date is required'
        },
        notNull: {
          msg: 'Payroll Date is required'
        }
      }
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Payroll Date is required'
        },
        notNull: {
          msg: 'Payroll Date is required'
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
    modelName: 'PayrollExpense',
  });

  return PayrollExpense;
};