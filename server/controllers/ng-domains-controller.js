const Model = require('../models/model');

/**
 * NG Domains Controller
 */
module.exports = {
  /**
   * NG ドメインを返す
   * 
   * @param req リクエスト
   * @param res レスポンス
   */
  findAll: (req, res) => {
    const userId = req.user.id;
    
    Model.NgDomain.findAll({
      where: {
        userId: userId
      }
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
   * NG ドメインを追加 (更新) する
   * 
   * @param req リクエスト
   * @param res レスポンス
   */
  upsert: (req, res) => {
    const userId = req.user.id;
    const ngDomain = req.body.ngDomain;
    
    Model.NgDomain.upsert({
      userId: userId,
      domain: ngDomain
    }, {
      returning: true  // 登録した情報を返す
    })
      .then((result) => {
        res.status(201);  // No Content (OK)
        res.json(result[0]);  // 登録したオブジェクトを返す
      })
      .catch((error) => {
        res.status(500);  // Internal Error
        res.json(error);
      });
  },
  
  /**
   * ID を指定して NG ドメインを削除する
   * 
   * @param req リクエスト
   * @param res レスポンス
   */
  remove: (req, res) => {
    const userId = req.user.id;
    const ngDomainId = req.params.id;
    
    Model.NgDomain.destroy({
      where: {
        id: ngDomainId,
        userId: userId
      }
    })
      .then((result) => {
        res.status(201);  // No Content (OK)
        res.json(result);  // 削除した件数 (1) が返る
      })
      .catch((error) => {
        res.status(500);  // Internal Error
        res.json(error);
      });
  }
};
