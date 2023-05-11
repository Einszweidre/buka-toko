'use strict';
const rupiahFormat=require('../helpers/rupiahFormat')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    get rupiahFormat(){
      return rupiahFormat(this.price)
    }
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category)
      Product.belongsTo(models.User, {
        foreignKey: 'SellerId',
        as: 'Seller'
      })
      Product.belongsToMany(models.Transaction, {
        through: models.ProductsTransaction
      })
    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    SellerId: DataTypes.INTEGER,
    CategoryId: DataTypes.INTEGER,
    picture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};