const Model = require('../models/model');

/**
 * NG URLs Controller
 */
module.exports = {
  /**
   * NG URL を追加 (更新) する
   * 
   * @param req リクエスト
   * @param res レスポンス
   */
  upsert: (req, res) => {
    const userId = req.user.id;
    const ngUrl = req.body.ngUrl;
    
    Model.NgUrl.upsert({
      userId: userId,
      url   : ngUrl
    }, {
      returning: true  // 登録した情報を返す : false (未設定だと result は true しか返ってこないが、true にすると [ResultObject, true] になる)
    })
      .then((result) => {
        res.status(201);  // No Content (OK)
        res.json(result[0]);  // 登録したオブジェクトを返す
      })
      .catch((error) => {
        res.status(500);  // Internal Error
        res.json(error);
      });
  }
};
