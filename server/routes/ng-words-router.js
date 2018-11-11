const express = require('express');

const isAuthenticated = require('./func-is-authenticated');
const ngWordsController = require('../controllers/ng-words-controller');

/**
 * NG ワードのルーティング

 */
const router = express.Router();

// NG ワードを取得する
router.get('/', isAuthenticated, (req, res) => {
  ngWordsController.findAll(req, res);
});

// NG ワードを追加する
router.put('/', isAuthenticated, (req, res) => {
  ngWordsController.upsert(req, res);
});

// NG ワードを削除する
router.delete('/:id', isAuthenticated, (req, res) => {
  ngWordsController.remove(req, res);
});

module.exports = router;
