const express = require('express');

const isAuthenticated = require('./func-is-authenticated');

/**
 * ルート配下のルーティングモジュールを返す
 */
const router = express.Router();

// デバッグ用 : マウント・パスを指定していないので全てのアクセスで実行させる
router.use((req, _res, next) => {
  console.log(`${req.url} [${req.method}] : ${JSON.stringify(req.body)}`);
  next();
});

// ルートで Angular アプリを提供する
router.use('/', require('./angular-app-router'));

// ログイン・ログアウトに関するルーティングを定義する
router.use('/', require('./auth-router'));



// TODO : 以降作っていく…
router.get('/member-only', isAuthenticated, (req, res) => {
  console.log('メンバオンリー', { userInfo: req.user, content: `Member Only!` })
  res.json({ userInfo: req.user, content: `Member Only!` });
});
// テスト
router.get('/category-entry', (req, res) => {
  const Model = require('../models/model');
  Model.Category.findAll({
    include: [{
      model: Model.Entry,
      required: false  // true : INNER JOIN , false : OUTER JOIN
    }],
    order: [
      ['id', 'ASC']
    ]
  })
    .then ((r) => { console.log('成功', r); res.send(r); })
    .catch((e) => { console.log('失敗', e); res.send(e); });
});



module.exports = router;
