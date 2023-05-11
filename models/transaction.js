'use strict';
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
      Transaction.belongsToMany(models.Product, {through: models.ProductsTransaction})
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
  return Transaction;
};