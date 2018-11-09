const express = require('express');

const isAuthenticated = require('./func-is-authenticated');

/**
 * ルート配下のルーティングモジュール
 */
const router = express.Router();

// デバッグ用 : マウント・パスを指定していないので全てのアクセスで実行させる
router.use((req, _res, next) => {
  console.log(`${req.url} [${req.method}] : ${JSON.stringify(req.body)}`);
  next();
});

router.use('/'          , require('./angular-app-router'));  // ルートで Angular アプリを提供する
router.use('/'          , require('./auth-router'       ));  // ログイン・ログアウト
router.use('/categories', require('./categories-router' ));  // カテゴリ
router.use('/ng-data'   , require('./ng-data-router'    ));  // NG 情報



// ----------------------------------------------------------------------------------------------------

// TODO : 以降作っていく…
router.get('/member-only', isAuthenticated, (req, res) => {
  console.log('メンバオンリー', { userInfo: req.user, content: `Member Only!` })
  res.json({ userInfo: req.user, content: `Member Only!` });
});

// ----------------------------------------------------------------------------------------------------



module.exports = router;
