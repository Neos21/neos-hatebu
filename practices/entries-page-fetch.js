const requestPromise = require('request-promise');
const cheerio = require('cheerio');

/**
 * エントリ一覧ページをスクレイピングして HTML データを取得する
 * 
 * @param url エントリ一覧ページの URL
 * @return Promise<$> エントリ一覧ページの jQuery-Like オブジェクト
 */
module.exports = (url) => {
  console.log(`ページ取得開始 : ${url}`);
  return requestPromise.get(url, {
    transform: (rawHtml) => {
      // jQuery オブジェクトに変換しておく
      return cheerio.load(rawHtml);
    }
  })
    .then(($) => {
      console.log(`ページ取得成功 : ${url}`);
      return $;
    })
    .catch((error) => {
      console.error(`ページ取得失敗 : ${url}`, error);
    });
};
