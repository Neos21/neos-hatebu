const Model = require('../models/model');

/**
 * NG Data Controller
 */
module.exports = {
  /**
   * NG URL・NG ワード・NG ドメインをまとめて返す
   * 
   * @param req リクエスト
   * @param res レスポンス
   */
  findAll: (req, res) => {
    const userId = req.user.id;
    
    // 返却するオブジェクト
    const returnObj = {
      ngUrls   : [],
      ngWords  : [],
      ngDomains: []
    }
    
    // NG URL の取得
    Model.NgUrl.findAll({
      where: {
        userId: userId
      }
    })
      .then((results) => {
        returnObj.ngUrls = results;
        
        // NG ワードの取得
        return Model.NgWord.findAll({
          where: {
            userId: userId
          }
        });
      })
      .then((results) => {
        returnObj.ngWords = results;
        
        // NG ドメインの取得
        return Model.NgDomain.findAll({
          where: {
            userId: userId
          }
        });
      })
      .then((results) => {
        returnObj.ngDomains = results;
        
        res.status(200);  // OK
        res.json(returnObj);
      })
      .catch((error) => {
        res.status(404);  // Not Found
        res.json(error);
      });
  }
};
