'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transactionCode: {
        type: Sequelize.STRING,
        length: 20
      },
      paymentDate: {
        type: Sequelize.DATE
      },
      deliveredDate: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING,
        length: 20
      },
      UserId: {
        type: Sequelize.INTEGER,
        references:{
          model: 'Users',
          key:'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      deliveryAddress: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};