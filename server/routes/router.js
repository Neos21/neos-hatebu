const express = require('express');

/**
 * ルート配下のルーティングモジュール
 */
const router = express.Router();

// デバッグ用 : マウント・パスを指定していないので全てのアクセスで実行させる
router.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.url} [${req.method}] : ${JSON.stringify(req.body)}`);
  next();
});

router.use('/'          , require('./angular-app-router'));  // ルートで Angular アプリを提供する
router.use('/'          , require('./auth-router'       ));  // ログイン・ログアウト
router.use('/categories', require('./categories-router' ));  // カテゴリ
router.use('/ng-data'   , require('./ng-data-router'    ));  // NG 情報 (一括返却)
router.use('/ng-urls'   , require('./ng-urls-router'    ));  // NG URL
router.use('/ng-words'  , require('./ng-words-router'   ));  // NG ワード
router.use('/ng-domains', require('./ng-domains-router' ));  // NG ドメイン

module.exports = router;
