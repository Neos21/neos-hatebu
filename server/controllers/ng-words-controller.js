const Model = require('../models/model');

/**
 * NG Words Controller
 */
module.exports = {
  /**
   * NG ワードを返す
   * 
   * @param req リクエスト
   * @param res レスポンス
   */
  findAll: (req, res) => {
    const userId = req.user.id;
    
    Model.NgWord.findAll({
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
   * NG ワードを追加 (更新) する
   * 
   * @param req リクエスト
   * @param res レスポンス
   */
  upsert: (req, res) => {
    const userId = req.user.id;
    const ngWord = req.body.ngWord;
    
    Model.NgWord.upsert({
      userId: userId,
      word: ngWord
    }, {
      returning: true  // 登録した情報を返す
    })
      .then((result) => {
        console.log('NG ワード追加成功', result[0]);
        res.status(201);  // No Content (OK)
        res.json(result[0]);  // 登録したオブジェクトを返す
      })
      .catch((error) => {
        console.log('NG ワード追加失敗', error);
        res.status(500);  // Internal Error
        res.json(error);
      });
  },
  
  /**
   * ID を指定して NG ワードを削除する
   * 
   * @param req リクエスト
   * @param res レスポンス
   */
  remove: (req, res) => {
    const userId = req.user.id;
    const ngWordId = req.params.id;
    
    Model.NgWord.destroy({
      where: {
        id: ngWordId,
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
