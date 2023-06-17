'use strict';
const {
  Model
} = require('sequelize');
const uuid = require('uuidv4');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User,Store}) {
      // define association here
      this.hasMany(User,{foreignKey: 'addressId'})
      this.hasOne(Store, {foreignKey: 'addressId'});
    }
  }
  Address.init({
    houseNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'house_number',
    },
    road: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ward: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'addresses',
    modelName: 'Address',
  });

  Address.beforeCreate(address => address.id = uuid.uuid())

  return Address;
};