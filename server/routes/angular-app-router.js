const express = require('express');
const path = require('path');

/**
 * Angular アプリを返すルーティング
 */
const router = express.Router();

// 以下の設定だけで index.html も返せている様子
router.use('/', express.static(`${__dirname}/../../dist`));

// ルートへのアクセス時は念のため index.html を返すようにしておく
router.get('/', (_req, res) => {
  res.sendFile(path.join(`${__dirname}/../../dist/index.html`));
});

module.exports = router;
