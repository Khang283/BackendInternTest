'use strict';
const {
  Model
} = require('sequelize');
const uuidv4 = require('uuidv4');
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User,Address,Employee,Request}) {
      // define association here
      this.belongsTo(User,{foreignKey: 'ownerId'})
      this.belongsTo(Address, {foreignKey: 'addressId'})
      this.hasMany(Employee, {foreignKey: 'storeId'})
      this.hasMany(Request, {foreignKey: "storeId"})
    }
  }
  Store.init({
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
    }
  }, {
    sequelize,
    tableName: 'stores',
    modelName: 'Store',
  });

  Store.beforeCreate(store=>store.id=uuidv4.uuid());
  return Store;
};