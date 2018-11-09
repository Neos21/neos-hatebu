const fs = require('fs');
const cheerio = require('cheerio');
const Sequelize = require('sequelize');

// 設定をロードする
require('dotenv').config();

/** テスト用にエントリ情報を入れる */

// ローカルに用意した HTML ファイルを取得する
const fileNames = fs.readdirSync(`${__dirname}/web-20181109/`);
const files = fileNames.map((fileName) => {
  return fs.readFileSync(`${__dirname}/web-20181109/${fileName}`, 'UTF-8');
});

// jQuery-Like オブジェクトに変換する
const htmls = files.map((file) => {
  return cheerio.load(file);
});

// パースして Entries テーブル向けのオブジェクトにまとめる
const entries = [];
htmls.forEach(($, categoryIndex) => {
  // カテゴリ ID を作る
  const categoryId = categoryIndex + 1;
  // ページタイトル
  const pageTitle = `${$('title').text()}`.replace('はてなブックマーク - ', '');
  
  // エントリごとに処理する
  // console.log($('.entrylist-contents').length);  // 人気 49 件・新着は 29 件取得できている
  $('.entrylist-contents').each((_index, element) => {
    // ブクマ数
    const count = $(element).find('.entrylist-contents-users span').text();
    // 日時 (YYYY/MM/DD HH:mm)
    const date = $(element).find('.entrylist-contents-date').text();
    // リンク要素
    const linkElem = $(element).find('.entrylist-contents-title a');
    // 記事タイトル
    const title = linkElem.attr('title');
    // URL
    const url = linkElem.attr('href');
    // 本文抜粋
    const description = $(element).find('.entrylist-contents-description').text();
    // Favicon URL
    const faviconUrl = $(element).find('.entrylist-contents-domain img').attr('src');
    // サムネイル : サムネイルがない記事は span 要素がなく、最終的な文字列が 'undefined' になるので空文字に修正
    let thumbnailUrl = `${$(element).find('.entrylist-contents-thumb span').attr('style')}`.replace('background-image:url(\'', '').replace('\');', '');
    if(thumbnailUrl === 'undefined') { thumbnailUrl = ''; }
    
    // エントリ一覧に追加する
    entries.push({ categoryId, count, date, title, url, description, faviconUrl, thumbnailUrl });
  });
});

console.log(`INSERT 件数 : ${entries.length}`);

// DB 接続する
const connectionString = process.env.DATABASE_URL;
console.log('接続開始', connectionString);
const sequelize = new Sequelize(connectionString, {
  logging: false
});

// モデルを定義する
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
Entry.sync();

// SELECT (確認用)
// Entry.findAll()
//   .then((result) => {
//     console.log('全件', result.length);
//   });

// INSERT
Entry.bulkCreate(entries)
  .then((result) => {
    console.log('Bulk Create 成功');
  })
  .catch((error) => {
    console.log('Bulk Create 失敗', error);
  });
