const RssParser = require('rss-parser');

/**
 * RSS を取得して JSON 形式にパースし、必要な情報のみに揃えた JSON オブジェクトにする
 * 
 * @param url エントリ一覧の RSS URL
 * @return Promise<object> エントリ一覧 (配列) を持つオブジェクト
 */
module.exports = (url) => {
  console.log(`RSS 取得開始 : ${url}`);
  const rssParser = new RssParser();
  return rssParser.parseURL(url)
    .then((feed) => {
      console.log(`RSS 取得成功 : ${url}`);
      return feed.items;  // date, title, link, content
    })
    .catch((error) => {
      console.error(`RSS 取得失敗 : ${url}`, error);
    });
};
