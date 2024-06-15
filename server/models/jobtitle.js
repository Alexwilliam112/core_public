'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Jobtitle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Employment, {
        foreignKey: 'JobtitleId'
      })
    }
  }
  Jobtitle.init({
    jobtitleName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Jobtitle already exists'
      },
      validate: {
        notNull: {
          msg: 'Jobtitle name is required'
        },
        notEmpty: {
          msg: 'Jobtitle name is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Jobtitle',
    timestamps: false
  });
  return Jobtitle;
};