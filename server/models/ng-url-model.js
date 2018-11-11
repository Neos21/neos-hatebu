const Sequelize = require('sequelize');

/**
 * ng_urls テーブル
 * 
 * @param sequelize Sequelize インスタンス
 * @return テーブルのモデル
 */
module.exports = (sequelize) => {
  const NgUrl = sequelize.define('ng_urls', {
    id       : { field: 'id'        , type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },  // ID (勝手に生成されるようなので用途はないが作っておく)
    userId   : { field: 'user_id'   , type: Sequelize.INTEGER, allowNull: false },  // ユーザ ID (users.id)
    url      : { field: 'url'       , type: Sequelize.TEXT   , allowNull: false },  // NG URL (イメージ的にはユーザ ID との複合ユニークだが UPSERT で対処する)
    createdAt: { field: 'created_at', type: Sequelize.DATE   , allowNull: false }   // 登録日 (一定期間後に削除するため)
  }, {
    updatedAt: false
  });
  
  NgUrl.sync();
  
  return NgUrl;
};
