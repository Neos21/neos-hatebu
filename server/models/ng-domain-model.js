const Sequelize = require('sequelize');

/**
 * ng_domains テーブル
 * 
 * @param sequelize Sequelize インスタンス
 * @return テーブルのモデル
 */
module.exports = (sequelize) => {
  const NgDomain = sequelize.define('ng_domains', {
    id    : { field: 'id'     , type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },  // ID (削除時の特定に使用)
    userId: { field: 'user_id', type: Sequelize.INTEGER, allowNull: false },  // ユーザ ID (users.id)
    domain: { field: 'domain' , type: Sequelize.TEXT   , allowNull: false },  // NG ドメイン (イメージ的にはユーザ ID との複合ユニークだが厳密にチェックもしないでいいかと)
  }, {
    createdAt: false,
    updatedAt: false
  });
  
  NgDomain.sync();
  
  return NgDomain;
};
