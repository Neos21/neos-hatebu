const requestPromise = require('request-promise');
const cheerio = require('cheerio');

const Model = require('../models/model');

/**
 * Categories Controller
 */
module.exports = {
  /**
   * カテゴリのみ全件取得
   * 
   * @param _req リクエスト
   * @param res レスポンス
   */
  findAll: (_req, res) => {
    Model.Category.findAll({
      order: [
        ['id', 'ASC']
      ]
    })
      .then((results) => {
        res.status(200);  // OK
        res.json(results);
      })
      .catch((error) => {
        res.status(404);  // Not Found
        res.json(error);
      });
  },
  
  /**
   * 指定の ID のカテゴリ情報とエントリ一覧を取得する
   * 
   * @param req リクエスト
   * @param res レスポンス
   */
  findById: (req, res) => {
    const id = req.params.id;
    Model.Category.findById(id, {
      include: [{
        model: Model.Entry,
        required: false  // OUTER JOIN
      }]
    })
      .then((result) => {
        res.status(200);  // OK
        res.json(result);
      })
      .catch((error) => {
        res.status(404);  // Not Found
        res.json(error);
      });
  },
  
  /**
   * 指定のカテゴリ ID のエントリ一覧を再スクレイピングする
   * 
   * @param req リクエスト
   * @param res レスポンス
   */
  reloadById: (req, res) => {
    const categoryId = req.params.id;
    
    // スクレイピングして INSERT するエントリ一覧
    const insertEntries = [];
    
    // ID からカテゴリ情報を取得する (ページ URL を取得するため)
    Model.Category.findById(categoryId)
      .then((category) => {
        // ページ URL を指定してスクレイピングする
        return requestPromise.get(category.pageUrl, {
          headers: {
            // UA を偽装しないと 503 ページに飛ばされたので Windows Chrome の UA を利用する
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
          },
          transform: (rawHtml) => {
            // jQuery オブジェクトに変換しておく
            return cheerio.load(rawHtml);
          }
        });
      })
      .then(($) => {
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
        
        // INSERT の準備ができたので、先に指定のカテゴリ ID のエントリ一覧を削除する
        return Model.Entry.destroy({
          where: {
            categoryId: categoryId
          }
        });
      })
      .then((_result) => {
        // 事前削除完了 (_result は削除件数)・エントリ一覧を一括追加する
        return Model.Entry.bulkCreate(insertEntries);
      })
      .then((_afterEntries) => {
        // 一括追加完了 (_afterEntries.length は追加件数)・カテゴリテーブルの最終クロール日時も更新する
        return Model.Category.update({ }, {
          where: {
            id: categoryId
          }
        });
      })
      .then((_result) => {
        // カテゴリテーブル更新完了 (_result は更新データ)・エントリ情報とまとめて再度取得する
        return Model.Category.findById(categoryId, {
          include: [{
            model: Model.Entry,
            required: false  // OUTER JOIN
          }]
        });
      })
      .then((result) => {
        res.status(200);  // OK
        res.json(result);
      })
      .catch((error) => {
        res.status(500);  // Internal Error : ココだけは特別に 404 ではなく 500 を指定
        res.json(error);
      });
  }
};
