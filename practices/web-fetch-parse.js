const requestPromise = require('request-promise');
const cheerio = require('cheerio');

/**
 * エントリ一覧ページをスクレイピングして JSON にまとめて返却する
 * 
 * @param url エントリ一覧ページの URL
 * @return Promise<object> エントリ一覧ページの JSON データ
 */
const parseWeb = (url) => {
  console.log(`ページ取得開始 : ${url}`);
  return requestPromise.get(url, {
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
      console.log(`ページ取得成功 : ${url}`);
      
      // ページタイトル
      const pageTitle = `${$('title').text()}`.replace('はてなブックマーク - ', '');
      
      // エントリ一覧
      const entries = [];
      
      // エントリごとに処理する
      console.log($('.entrylist-contents').length);  // 49 件取得できている
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
        // サムネイル
        const thumbnailUrl = `${$(element).find('.entrylist-contents-thumb span').attr('style')}`.replace('background-image:url(\'', '').replace('\');', '');
        
        // エントリ一覧に追加する
        entries.push({ count, date, title, url, description, faviconUrl, thumbnailUrl });
      });
      
      console.log('結果', { pageTitle, entries });
      return { pageTitle, entries };
    })
    .catch((error) => {
      console.error(`ページ取得失敗 : ${url}`, error);
    });
};

// エントリ一覧ページの URL 一覧
const webUrls = [
  'http://b.hatena.ne.jp/hotentry/all',
  'http://b.hatena.ne.jp/entrylist/all',
  'http://b.hatena.ne.jp/hotentry/general',
  'http://b.hatena.ne.jp/entrylist/general',
  'http://b.hatena.ne.jp/hotentry/social',
  'http://b.hatena.ne.jp/entrylist/social',
  'http://b.hatena.ne.jp/hotentry/economics',
  'http://b.hatena.ne.jp/entrylist/economics',
  'http://b.hatena.ne.jp/hotentry/life',
  'http://b.hatena.ne.jp/entrylist/life',
  'http://b.hatena.ne.jp/hotentry/knowledge',
  'http://b.hatena.ne.jp/entrylist/knowledge',
  'http://b.hatena.ne.jp/hotentry/it',
  'http://b.hatena.ne.jp/entrylist/it',
  'http://b.hatena.ne.jp/hotentry/fun',
  'http://b.hatena.ne.jp/entrylist/fun',
  'http://b.hatena.ne.jp/hotentry/entertainment',
  'http://b.hatena.ne.jp/entrylist/entertainment',
  'http://b.hatena.ne.jp/hotentry/game',
  'http://b.hatena.ne.jp/entrylist/game',
];

// 実行
// parseWeb(webUrls[2]);
