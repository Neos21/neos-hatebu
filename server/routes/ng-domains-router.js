const express = require('express');

const isAuthenticated = require('./func-is-authenticated');
const ngDomainsController = require('../controllers/ng-domains-controller');

/**
 * NG ドメインのルーティング
 */
const router = express.Router();

// NG ドメインを取得する
router.get('/', isAuthenticated, (req, res) => {
  ngDomainsController.findAll(req, res);
});

// NG ドメインを追加する
router.put('/', isAuthenticated, (req, res) => {
  ngDomainsController.upsert(req, res);
});

// NG ドメインを削除する
router.delete('/:id', isAuthenticated, (req, res) => {
  ngDomainsController.remove(req, res);
});

module.exports = router;
