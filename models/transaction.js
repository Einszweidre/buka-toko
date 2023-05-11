'use strict';
const padNumber=require('../helpers/padNumber')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User)
      Transaction.belongsToMany(models.Product, {
        through: models.ProductsTransaction,
        foreignKey: 'TransactionId'
      })
      Transaction.hasMany(models.ProductsTransaction)
    }
  }
  Transaction.init({
    transactionCode: DataTypes.STRING,
    paymentDate: DataTypes.DATE,
    deliveredDate: DataTypes.DATE,
    status: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    deliveryAddress: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transaction',
  });

  Transaction.beforeCreate((transaction) => {
    const date = new Date();
    const userId = transaction.UserId; // replace with the actual user ID
    const transactionCode = `TR${userId}${date.getFullYear()}${padNumber(date.getMonth() + 1)}${padNumber(date.getDate())}${padNumber(date.getHours())}${padNumber(date.getMinutes())}${padNumber(date.getSeconds())}${padNumber(date.getMilliseconds(), 3)}`;

    transaction.transactionCode = transactionCode
  })

  return Transaction;
};