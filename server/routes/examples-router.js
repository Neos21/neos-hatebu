const express = require('express');

// ルータをモジュールとして作成する
const router = express.Router();

// コントローラを用意する
const ExamplesController = require('../controllers/examples-controller');
const examplesController = new ExamplesController();

// 全件取得
router.get('/', (req, res) => {
  examplesController.findAll(res);
});

// ID を指定して1件取得
router.get('/:id', (req, res) => {
  examplesController.findById(req, res);
});

// 登録
router.post('/', (req, res) => {
  examplesController.create(req, res);
});

// 更新
router.put('/:id', (req, res) => {
  examplesController.update(req, res);
});

// 削除
router.delete('/:id', (req, res) => {
  examplesController.delete(req, res);
});

module.exports = router;
