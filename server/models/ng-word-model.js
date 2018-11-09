const Sequelize = require('sequelize');

/**
 * ng_words テーブル
 * 
 * @param sequelize Sequelize インスタンス
 * @return テーブルのモデル
 */
module.exports = (sequelize) => {
  const NgWord = sequelize.define('ng_words', {
    userId: { field: 'user_id', type: Sequelize.INTEGER, allowNull: false },  // ユーザ ID (users.id)
    word  : { field: 'word'   , type: Sequelize.TEXT   , allowNull: false },  // NG ワード (イメージ的にはユーザ ID との複合ユニークだが厳密にチェックもしないでいいかと)
  }, {
    createdAt: false,
    updatedAt: false
  });
  
  NgWord.sync();
  
  return NgWord;
};
