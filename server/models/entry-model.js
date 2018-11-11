const Sequelize = require('sequelize');

/**
 * entries テーブル
 * 
 * @param sequelize Sequelize インスタンス
 * @return テーブルのモデル
 */
module.exports = (sequelize) => {
  const Entry = sequelize.define('entries', {
    id          : { field: 'id'           , type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },  // エントリ ID
    categoryId  : { field: 'category_id'  , type: Sequelize.INTEGER, allowNull: false },  // 紐付く category.id
    title       : { field: 'title'        , type: Sequelize.TEXT   , allowNull: false },  // 記事タイトル
    url         : { field: 'url'          , type: Sequelize.TEXT   , allowNull: false },  // 記事 URL
    description : { field: 'description'  , type: Sequelize.TEXT                      },  // 記事本文抜粋
    count       : { field: 'count'        , type: Sequelize.INTEGER                   },  // ブクマ数
    date        : { field: 'date'         , type: Sequelize.TEXT                      },  // 日時
    faviconUrl  : { field: 'favicon_url'  , type: Sequelize.TEXT                      },  // Favicon URL
    thumbnailUrl: { field: 'thumbnail_url', type: Sequelize.TEXT                      },  // サムネイル URL
    updatedAt   : { field: 'updated_at'   , type: Sequelize.DATE                      }   // 最終クロール日時
  }, {
    createdAt: false
  });
  
  // Category : Entry で 1:n の関係であることを示す
  Entry.associate = (Model) => {
    Entry.belongsTo(Model.Category, {
      foreignKey: 'categoryId', // Entry にある category.id のカラム名
      targetKey : 'id'          // 対応する Category のカラム名
    });
  };
  
  Entry.sync();
  
  return Entry;
};
