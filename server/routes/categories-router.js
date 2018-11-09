const express = require('express');

const isAuthenticated = require('./func-is-authenticated');
const categoriesController = require('../controllers/categories-controller');

/**
 * カテゴリ情報のルーティング
 */
const router = express.Router();

// カテゴリのみ全件取得
router.get('/', isAuthenticated, (req, res) => {
  categoriesController.findAll(req, res);
});

// 指定の ID のカテゴリ情報とエントリ一覧を取得する
router.get('/:id', isAuthenticated, (req, res) => {
  categoriesController.findById(req, res);
})

module.exports = router;
