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
  }
};
