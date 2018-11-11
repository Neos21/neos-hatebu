const Sequelize = require('sequelize');

/**
 * users テーブル
 * 
 * @param sequelize Sequelize インスタンス
 * @return テーブルのモデル
 */
module.exports = (sequelize) => {
  // モデルを定義する
  const User = sequelize.define('users', {
    id      : { field: 'id'       , type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    userName: { field: 'user_name', type: Sequelize.TEXT   , allowNull: false },
    password: { field: 'password' , type: Sequelize.TEXT   , allowNull: false }
  }, {
    createdAt: false,
    updatedAt: false
  });
  
  // テーブルがなければ作成し DB と同期する
  User.sync();
  
  return User;
};
