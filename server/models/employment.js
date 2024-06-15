'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'UserId'
      })
      this.belongsTo(models.Jobtitle, {
        foreignKey: 'JobtitleId'
      })
      this.hasMany(models.PayrollDetail, {
        foreignKey: 'EmploymentId',
        onDelete: 'SET NULL'
      })
    }
  }
  Employment.init({
    employeeName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Employee Name is required'
        },
        notNull: {
          msg: 'Employee Name is required'
        }
      }
    },
    docStatus: {
      type: DataTypes.ENUM(['Active', 'Terminated']),
      defaultValue: 'Active'
    },
    employmentType: {
      type: DataTypes.ENUM(['Owner', 'Employee', 'Probation', 'Contract']),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Employment Type is required'
        },
        notNull: {
          msg: 'Employment Type is required'
        },
        isIn: {
          args: [['Owner', 'Employee', 'Probation', 'Contract']],
          msg: 'Invalid Employment Type'
        }
      }
    },
    joinDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Join Date is required'
        },
        notNull: {
          msg: 'Join Date is required'
        }
      },
    },
    salary: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Salary amount is required'
        },
        notNull: {
          msg: 'Salary amount is required'
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
          msg: 'Bank Account Number is required'
        },
        notNull: {
          msg: 'Bank Account Number is required'
        }
      }
    },
    UserId: {
      type: DataTypes.INTEGER
    },
    JobtitleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please select a Jobtitle'
        },
        notNull: {
          msg: 'Please select a Jobtitle'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Employment',
    timestamps: false
  });
  return Employment;
};