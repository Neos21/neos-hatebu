const RssParser = require('rss-parser');

/**
 * RSS を取得して JSON 形式にパースし、必要な情報のみに揃えた JSON オブジェクトにする
 * 
 * @param url エントリ一覧の RSS URL
 * @return Promise<object> エントリ一覧 (配列) を持つオブジェクト
 */
const parseRss = (url) => {
  console.log(`RSS 取得開始 : ${url}`);
  const rssParser = new RssParser();
  return rssParser.parseURL(url)
    .then((feed) => {
      console.log(`RSS 取得成功 : ${url}`);  // 30件取得できる
      console.log(feed.items.length)
      return feed.items;  // date (YYYY-MM-DDTHH:mm:ssZ), title, link, content
    })
    .catch((error) => {
      console.error(`RSS 取得失敗 : ${url}`, error);
    });
};

// RSS の URL 一覧
const rssUrls = [
  'http://b.hatena.ne.jp/hotentry.rss',
  'http://b.hatena.ne.jp/entrylist.rss',
  'http://b.hatena.ne.jp/hotentry/general.rss',
  'http://b.hatena.ne.jp/entrylist/general.rss',
  'http://b.hatena.ne.jp/hotentry/social.rss',
  'http://b.hatena.ne.jp/entrylist/social.rss',
  'http://b.hatena.ne.jp/hotentry/economics.rss',
  'http://b.hatena.ne.jp/entrylist/economics.rss',
  'http://b.hatena.ne.jp/hotentry/life.rss',
  'http://b.hatena.ne.jp/entrylist/life.rss',
  'http://b.hatena.ne.jp/hotentry/knowledge.rss',
  'http://b.hatena.ne.jp/entrylist/knowledge.rss',
  'http://b.hatena.ne.jp/hotentry/it.rss',
  'http://b.hatena.ne.jp/entrylist/it.rss',
  'http://b.hatena.ne.jp/hotentry/fun.rss',
  'http://b.hatena.ne.jp/entrylist/fun.rss',
  'http://b.hatena.ne.jp/hotentry/entertainment.rss',
  'http://b.hatena.ne.jp/entrylist/entertainment.rss',
  'http://b.hatena.ne.jp/hotentry/game.rss',
  'http://b.hatena.ne.jp/entrylist/game.rss'
];

// 実行
parseRss(rssUrls[0]);
