const express = require('express');

/**
 * ログイン・ログアウトのルーティング
 */
module.exports = (passport) => {
  const router = express.Router();
  
  // ログイン
  router.post('/login', passport.authenticate('local', {
    session: true
  }), (req, res) => {
    // passport.use('local') で定義した認証処理が成功したらこの関数が実行される
    const userId = req.user;
    console.log('Login', userId);
    
    // Angular の HttpClient がエラー扱いにしないよう JSON を返す
    res.json({
      result: 'Login',
      userId: userId
    });
  });
  
  // ログアウト
  router.get('/logout', (req, res) => {
    const userId = req.user;
    console.log('Logout', userId);
    
    req.logout();
    res.json({
      result: 'Logout',
      userId: userId
    });
  });
  
  return router;
};
