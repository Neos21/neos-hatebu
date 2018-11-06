/**
 * スクレイピングしたエントリ一覧ページをパースし、必要な情報のみに揃えた JSON オブジェクトにする
 * 
 * @param $ エントリ一覧ページの jQuery-Like オブジェクト
 * @return object ページタイトルとエントリ一覧 (配列) を持つオブジェクト
 */
module.exports = ($) => {
  // ページタイトル
  const pageTitle = `${$('title').text()}`.replace('はてなブックマーク - ', '');
  
  // エントリ一覧
  const entries = [];
  
  // エントリごとに処理する
  $('.entrylist-contents').each((index, element) => {
    // ブクマ数
    const users = $(element).find('.entrylist-contents-users span').text();
    // 日時
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
    const favicon = $(element).find('.entrylist-contents-domain img').attr('src');
    // サムネイル
    const thumb = $(element).find('.entrylist-contents-thumb span').attr('style').replace('background-image:url(\'', '').replace('\');', '');
    
    // エントリ一覧に追加する
    entries.push({ users, date, title, url, description, favicon, thumb });
  });
  
  return { pageTitle, entries };
};
