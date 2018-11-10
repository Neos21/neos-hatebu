const express = require('express');

const isAuthenticated = require('./func-is-authenticated');
const ngUrlsController = require('../controllers/ng-urls-controller');

/**
 * NG URL のルーティング

 */
const router = express.Router();

// NG URL を取得する
router.get('/', isAuthenticated, (req, res) => {
  ngUrlsController.findAll(req, res);
});

// NG URL を追加する
router.put('/', isAuthenticated, (req, res) => {
  ngUrlsController.upsert(req, res);
});

// NG URL を削除する (パラメータで日付指定)
router.delete('/', isAuthenticated, (req, res) => {
  ngUrlsController.remove(req, res);
});

module.exports = router;
