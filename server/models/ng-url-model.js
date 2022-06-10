const Sequelize = require('sequelize');

/**
 * ng_urls テーブル
 * 
 * @param sequelize Sequelize インスタンス
 * @return テーブルのモデル
 */
module.exports = (sequelize) => {
  const NgUrl = sequelize.define('ng_urls', {
    id          : { field: 'id'           , type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },  // ID (勝手に生成されるようなので用途はないが作っておく)
    userId      : { field: 'user_id'      , type: Sequelize.INTEGER, allowNull: false },  // ユーザ ID (users.id)
    title       : { field: 'title'        , type: Sequelize.TEXT   , allowNull: false },  // 記事タイトル (entries テーブルと同じ)
    url         : { field: 'url'          , type: Sequelize.TEXT   , allowNull: false },  // 記事 URL (entries テーブルと同じ・イメージ的にはユーザ ID との複合ユニークだが UPSERT で対処する)
    description : { field: 'description'  , type: Sequelize.TEXT                      },  // 記事本文抜粋 (entries テーブルと同じ)
    count       : { field: 'count'        , type: Sequelize.INTEGER                   },  // ブクマ数 (entries テーブルと同じ)
    date        : { field: 'date'         , type: Sequelize.TEXT                      },  // 日時 (entries テーブルと同じ)
    faviconUrl  : { field: 'favicon_url'  , type: Sequelize.TEXT                      },  // Favicon URL (entries テーブルと同じ)
    thumbnailUrl: { field: 'thumbnail_url', type: Sequelize.TEXT                      },  // サムネイル URL (entries テーブルと同じ)
    createdAt   : { field: 'created_at'   , type: Sequelize.DATE   , allowNull: false }   // 登録日 (一定期間後に削除するため)
  }, {
    updatedAt: false
  });
  
  NgUrl.sync();
  
  return NgUrl;
};
