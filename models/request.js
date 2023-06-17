'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User,Store}) {
      // define association here
      this.belongsTo(User,{foreignKey: 'userId'})
      this.belongsTo(Store,{foreignKey: 'storeId'})
    }
  }
  Request.init({
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      field: 'user_id',
    },
    storeId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      field: 'store_id',
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Đang chờ chấp nhận",
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: "Yêu cầu",
    },
  }, {
    sequelize,
    tableName: 'requests',
    modelName: 'Request',
  });
  return Request;
};