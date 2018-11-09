const Sequelize = require('sequelize');

/**
 * categories テーブル
 * 
 * @param sequelize Sequelize インスタンス
 * @return テーブルのモデル
 */
module.exports = (sequelize) => {
  const Category = sequelize.define('categories', {
    id       : { field: 'id'        , type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },  // カテゴリ ID
    name     : { field: 'name'      , type: Sequelize.TEXT, allowNull: false },  // カテゴリ名
    rssUrl   : { field: 'rss_url'   , type: Sequelize.TEXT, allowNull: false },  // RSS URL (RSS からのパース用)
    pageUrl  : { field: 'page_url'  , type: Sequelize.TEXT, allowNull: false },  // ページ URL (Web ページからのスクレイピング用)
    updatedAt: { field: 'updated_at', type: Sequelize.DATE, allowNull: false }   // 最終クロール日時
  }, {
    createdAt: false
  });
  
  // Category : Entry で 1:n の関係であることを示す
  Category.associate = (Model) => {
    Category.hasMany(Model.Entry, {
      foreignKey: 'categoryId'  // 対象 (Entry テーブル) のカラム名を指定する
    });
  }
  
  Category.sync();
  
  return Category;
};
