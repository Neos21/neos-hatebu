const express = require('express');

const isAuthenticated = require('./func-is-authenticated');

/**
 * ルート配下のルーティングモジュールを返す
 * 
 * @param passport Passport オブジェクト
 */
module.exports = (passport) => {
  // ルータをモジュールとして作成する
  const router = express.Router();
  
  // デバッグ用 : マウント・パスを指定していないので全てのアクセスで実行させる
  router.use((req, _res, next) => {
    console.log(`${req.url} [${req.method}] : ${JSON.stringify(req.body)}`);
    next();
  });
  
  // ルートで Angular アプリを提供する
  router.use('/', require('./angular-app-router')());
  
  // ログイン・ログアウトに関するルーティングを定義する
  router.use('/', require('./auth-router')(passport));
  
  
  
  router.get('/member-only', isAuthenticated, (req, res) => {
    console.log('メンバオンリー', { userInfo: req.user, content: `Member Only!` })
    res.json({ userInfo: req.user, content: `Member Only!` });
  });
  
  
  
  return router;
};
