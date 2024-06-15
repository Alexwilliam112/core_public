'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PayrollDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.PayrollExpense, {
        foreignKey: 'PayId'
      })
      this.belongsTo(models.Employment, {
        foreignKey: 'EmploymentId',
        onDelete: 'SET NULL'
      })
    }
  }
  PayrollDetail.init({
    employeeName: {
      type: DataTypes.STRING
    },
    salaryPaid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Salary Paid Amount is required'
        },
        notNull: {
          msg: 'Salary Paid Amount is required'
        }
      }
    },
    bank: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Bank is required'
        },
        notNull: {
          msg: 'Bank is required'
        }
      }
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Account Number is required'
        },
        notNull: {
          msg: 'Account Number is required'
        }
      }
    },
    EmploymentId: {
      type: DataTypes.INTEGER
    },
    PayId: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'PayrollDetail',
    timestamps: false
  });
  return PayrollDetail;
};