#!/usr/bin/env node

const Sequelize = require('sequelize');
const moment = require('moment-timezone');
const requestPromise = require('request-promise');
const cheerio = require('cheerio');

// 環境変数をロードする
require('dotenv').config();


// メイン処理
// ====================================================================================================


console.log('処理開始', new Date());
const Model = createModel();
removeNgUrls(Model)
  .then(() => {
    return findCategories(Model);
  })
  .then((categories) => {
    console.log('カテゴリ一覧取得', categories.length);
    return categories.reduce((prevPromise, category) => {
      return prevPromise
        .then(() => {
          console.log('直列処理', category.name);
          return scrapeEntries(Model, category.id, category.pageUrl);
        })
        .catch((error) => {
          console.error('エラー発生・続行', error);
          return Promise.resolve();
        });
    }, Promise.resolve());
  })
  .then(() => {
    console.log('正常終了', new Date());
    return process.exit(0);
  })
  .catch((error) => {
    console.error('原因不明のエラー・終了', new Date(), error);
    return process.exit(1);
  });

  
// モデル定義
// ====================================================================================================

/**
 * モデルを作成する
 * 
 * @return Model
 */
function createModel() {
  const Model = {};
  // DB 接続する
  const connectionString = process.env.DATABASE_URL;
  console.log('接続開始', connectionString);
  const sequelize = new Sequelize(connectionString, {
    timezone: '+09:00',  // JST タイムゾーン : Sequelize で SELECT すると全て UTC の ISO 形式になっており DB 上の記録と異なる
    logging: false  // ログ出力
  });
  // 各モデルを定義・格納する
  Model.Category = createCategoryModel(sequelize);
  Model.Entry    = createEntryModel(sequelize);
  Model.NgUrl    = createNgUrlModel(sequelize);
  // 各モデルが associate() 関数を定義していれば実行し、関係を定義する
  Object.keys(Model).forEach((key) => {
    const model = Model[key];
    if(model.associate) {
      model.associate(Model);
    }
  });
  // Sequelize を格納する
  Model.Sequelize = Sequelize;
  Model.sequelize = sequelize;
  console.log('モデル作成完了');
  return Model;
};

/**
 * NG URLs テーブルのモデルを作成する
 * 
 * @param sequelize Sequelize インスタンス
 * @return モデル
 */
function createNgUrlModel(sequelize) {
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

/**
 * Categories テーブルのモデルを作成する
 * 
 * @param sequelize Sequelize インスタンス
 * @return モデル
 */
function createCategoryModel(sequelize) {
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
      foreignKey: 'categoryId'  // 対象 (Entry テーブル) のカラム名
    });
  }
  Category.sync();
  return Category;
}

/**
 * Entries テーブルのモデルを作成する
 * 
 * @param sequelize Sequelize インスタンス
 * @return モデル
 */
function createEntryModel(sequelize) {
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
}


// DB 操作
// ====================================================================================================

/**
 * 過去の NG URL を削除する
 * 
 * @param Model モデル
 * @return Promise
 */
function removeNgUrls(Model) {
  console.log('5日前の NG URL を削除');
  return Model.NgUrl.destroy({
    where: {
      createdAt: {
        [Sequelize.Op.lt]: moment().subtract(5, 'days').toDate()
      }
    }
  });
}

/**
 * カテゴリ情報を全て取得する
 * 
 * @param Model モデル
 * @return Promise
 */
function findCategories(Model) {
  console.log('全カテゴリ情報取得');
  return Model.Category.findAll({
    order: [
      ['id', 'ASC']
    ]
  });
}

/**
 * スクレイピングする
 * 
 * @param Model モデル
 * @param categoryId カテゴリ ID
 * @param categoryPageUrl スクレイピングするページ URL
 * @return Promise
 */
function scrapeEntries(Model, categoryId, categoryPageUrl) {
  console.log('--- スクレイピング開始');
  // スクレイピングして INSERT するエントリ一覧
  const insertEntries = [];
  // ページ URL を指定してスクレイピングする
  return requestPromise.get(categoryPageUrl, {
    headers: {
      // UA を偽装しないと 503 ページに飛ばされたので Windows Chrome の UA を利用する
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
    },
    transform: (rawHtml) => {
      // jQuery オブジェクトに変換しておく
      return cheerio.load(rawHtml);
    }
  })
    .then(($) => {
      console.log('--- エントリパース');
      // ページ取得成功・エントリごとに処理する
      $('.entrylist-contents').each((_index, element) => {
        const linkElem = $(element).find('.entrylist-contents-title a');
        const title = linkElem.attr('title');
        const url = linkElem.attr('href');
        const description = $(element).find('.entrylist-contents-description').text();
        const count = $(element).find('.entrylist-contents-users span').text();
        const date = $(element).find('.entrylist-contents-date').text();  // YYYY/MM/DD HH:mm
        const faviconUrl = $(element).find('.entrylist-contents-domain img').attr('src');
        // サムネイル : サムネイルがない記事は span 要素がなく、最終的な文字列が 'undefined' になるので空文字に修正
        let thumbnailUrl = `${$(element).find('.entrylist-contents-thumb span').attr('style')}`.replace('background-image:url(\'', '').replace('\');', '');
        if(thumbnailUrl === 'undefined') {
          thumbnailUrl = '';
        }
        // エントリ一覧に追加する
        insertEntries.push({ categoryId, title, url, description, count, date, faviconUrl, thumbnailUrl });
      });
      console.log('--- 先に DELETE');
      // INSERT の準備ができたので、先に指定のカテゴリ ID のエントリ一覧を削除する
      return Model.Entry.destroy({
        where: {
          categoryId: categoryId
        }
      });
    })
    .then((_result) => {
      console.log('--- 一括 INSERT');
      // 事前削除完了 (_result は削除件数)・エントリ一覧を一括追加する
      return Model.Entry.bulkCreate(insertEntries);
    })
    .then((_afterEntries) => {
      console.log('--- Category 更新');
      // 一括追加完了 (_afterEntries.length は追加件数)・カテゴリテーブルの最終クロール日時も更新する
      return Model.Category.update({ }, {
        where: {
          id: categoryId
        }
      });
    });
}
