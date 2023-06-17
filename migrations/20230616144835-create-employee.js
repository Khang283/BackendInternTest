'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('employees', {
      userId:{
        type: DataTypes.UUID,
        field: 'user_id',
        allowNull: false,
        primaryKey: true,
      },
      storeId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: 'store_id',
      },
      status:{
        type: DataTypes.STRING,
        defaultValue: 'Đang làm việc',
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('employees');
  }
};