'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Store,User}) {
      // define association here
      this.belongsTo(Store,{foreignKey: 'storeId'})
      this.belongsTo(User,{foreignKey: 'userId'})
    }
  }
  Employee.init({
    userId:{
      type: DataTypes.UUID,
      field: 'user_id',
      primaryKey: true,
      allowNull: false,
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
    }
  }, {
    sequelize,
    tableName: 'employees',
    modelName: 'Employee',
  });
  return Employee;
};