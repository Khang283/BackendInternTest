'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('stores', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type:DataTypes.STRING,
        allowNull: false,
      },
      logo: {
        type:DataTypes.STRING,
  
      },
      phone: {
        type:DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type:DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      addressId:{
        type: DataTypes.UUID,
        allowNull: false,
        field: 'address_id',
      },
      ownerId:{
        type: DataTypes.UUID,
        allowNull: false,
        field: 'owner_id',
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
    await queryInterface.dropTable('stores');
  }
};