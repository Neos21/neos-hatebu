const Model = require('../models/model');

/**
 * NG Data Controller
 */
module.exports = {
  /**
   * NG URL・NG ワード・NG ドメインをまとめて返す
   * 
   * TODO : NG ワード・NG ドメイン作ったらマージする
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
    
    Model.NgUrl.findAll({
      where: {
        userId: userId
      }
    })
      .then((results) => {
        returnObj.ngUrls = results;
        
        return Model.NgWord.findAll({
          where: {
            userId: userId
          }
        });
      })
      .then((results) => {
        returnObj.ngWords = results;
        
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
  },
  
  // TODO : NG URL の追加
  // TODO : NG ワードの追加・削除
  // TODO : NG ドメインの追加・削除
};
