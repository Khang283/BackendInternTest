'use strict';
const {
  Model
} = require('sequelize');
const uuid = require('uuidv4');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Address,Employee,Request,Store}) {
      // define association here
      this.belongsTo(Address, {foreignKey: 'addressId'});
      this.hasMany(Employee,{foreignKey: 'userId'})
      this.hasMany(Request,{foreignKey: 'userId'})
      this.hasMany(Store, {foreignKey: 'ownerId'})
    }
  }
  User.init({
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'full_name',
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATE,
    },
    gender: {
      type: DataTypes.STRING,
    },
    avatar:{
      type: DataTypes.STRING,
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'user_type'
    },
    addressId: {
      type: DataTypes.UUID,
      field: 'address_id',
    },
    accountConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  });

  User.beforeCreate(user=>{user.id = uuid.uuid()});

  return User;
};