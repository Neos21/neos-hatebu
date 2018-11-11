const express = require('express');
const passport = require('passport');

const authController = require('../controllers/auth-controller');

/**
 * ログイン・ログアウトのルーティング
 */
const router = express.Router();

// ログイン
router.post('/login', passport.authenticate('local', {
  session: true
}), (req, res) => {
  // passport.use('local') で定義した認証処理が成功したらこの関数が実行される
  authController.login(req, res);
});

// ログアウト
router.get('/logout', (req, res) => {
  authController.logout(req, res);
});

module.exports = router;
