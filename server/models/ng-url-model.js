const Sequelize = require('sequelize');

/**
 * ng_urls テーブル
 * 
 * @param sequelize Sequelize インスタンス
 * @return テーブルのモデル
 */
module.exports = (sequelize) => {
  // ID カラムは勝手に生成される様子
  const NgUrl = sequelize.define('ng_urls', {
    userId   : { field: 'user_id'   , type: Sequelize.INTEGER, allowNull: false },  // ユーザ ID (users.id)
    url      : { field: 'url'       , type: Sequelize.TEXT   , allowNull: false },  // NG URL (イメージ的にはユーザ ID との複合ユニークだが UPSERT で対処する)
    createdAt: { field: 'created_at', type: Sequelize.DATE   , allowNull: false }   // 登録日 (一定期間後に削除するため)
  }, {
    updatedAt: false
  });
  
  NgUrl.sync();
  
  return NgUrl;
};
