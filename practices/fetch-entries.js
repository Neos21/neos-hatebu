const requestPromise = require('request-promise');
const cheerio = require('cheerio');

/**
 * エントリ取得
 * 
 * @param url エントリ一覧ページの URL
 * @return Promise<$> エントリ一覧ページの jQuery-Like オブジェクト
 */
module.exports = (url) => {
  console.log(`エントリ取得開始 : ${url}`);
  requestPromise.get(url, {
    transform: (rawHtml) => {
      // jQuery オブジェクトに変換しておく
      return cheerio.load(rawHtml);
    }
  })
    .then(($) => {
      console.log(`エントリ取得成功 : ${url}`);
      return $;
    })
    .catch((error) => {
      console.error(`エントリ取得失敗 : ${url}`, error);
    });
};
