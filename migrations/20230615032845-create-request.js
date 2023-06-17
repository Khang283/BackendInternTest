'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('requests', {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        field: 'user_id',
      },
      storeId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: 'store_id',
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "Đang chờ"
      },
      type: {
        type: DataTypes.STRING,
        defaultValue: "Yêu cầu"
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
    await queryInterface.dropTable('requests');
  }
};