const express = require('express');

const isAuthenticated = require('./func-is-authenticated');
const ngUrlsController = require('../controllers/ng-urls-controller');

/**
 * NG URL のルーティング

 */
const router = express.Router();

// NG URL を追加する
router.put('/', isAuthenticated, (req, res) => {
  ngUrlsController.upsert(req, res);
});

module.exports = router;
