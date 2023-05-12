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
        through: models.ProductsTransaction,
        foreignKey: 'ProductId'
      })
      Product.hasMany(models.ProductsTransaction)
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Name cannot be null`
        },
        notEmpty: {
          msg: `Name cannot be empty`
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Description cannot be null`
        },
        notEmpty: {
          msg: `Description cannot be empty`
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Price cannot be null`
        },
        notEmpty: {
          msg: `Price cannot be empty`
        }
      }
    },
    SellerId: DataTypes.INTEGER,
    CategoryId: DataTypes.INTEGER,
    picture: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Picture cannot be null`
        },
        notEmpty: {
          msg: `Picture cannot be empty`
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};