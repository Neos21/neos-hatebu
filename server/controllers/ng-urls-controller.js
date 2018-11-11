const Sequelize = require('sequelize');
const moment = require('moment-timezone');

const Model = require('../models/model');

/**
 * NG URLs Controller
 */
module.exports = {
  /**
   * NG URL を返す
   * 
   * @param req リクエスト
   * @param res レスポンス
   */
  findAll: (req, res) => {
    const userId = req.user.id;
    
    Model.NgUrl.findAll({
      where: {
        userId: userId
      },
      order: [
        ['createdAt', 'DESC']
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
  },
  
  /**
   * 指定の日付以前の NG URL を削除する
   * 
   * @param req リクエスト
   * @param res レスポンス
   */
  remove: (req, res) => {
    const userId = req.user.id;
    const date = req.query.date;
    
    Model.NgUrl.destroy({
      where: {
        userId: userId,
        createdAt: {
          [Sequelize.Op.lt]: moment(date, 'YYYY-MM-DD').toDate()
        }
      }
    })
      .then((result) => {
        res.status(201);  // No Content (OK)
        res.json(result);  // 削除した件数が返る
      })
      .catch((error) => {
        res.status(500);  // Internal Error
        res.json(error);
      });
  }
};
