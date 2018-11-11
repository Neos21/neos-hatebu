const express = require('express');

const isAuthenticated = require('./func-is-authenticated');
const ngDataController = require('../controllers/ng-data-controller');

/**
 * NG 情報のルーティング
 * テーブルとしては ng_urls・ng_words・ng_domains に別れているが、まとめて返す
 */
const router = express.Router();

// 対象ユーザの NG URL・NG ワード・NG ドメインをまとめて返す
router.get('/', isAuthenticated, (req, res) => {
  ngDataController.findAll(req, res);
});

module.exports = router;
