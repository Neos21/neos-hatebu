/**
 * Auth Controller
 */
module.exports = {
  /**
   * ログイン
   * 
   * @param req リクエスト
   * @param res レスポンス
   */
  login: (req, res) => {
    const userId = req.user;
    console.log('Login', userId);
    
    // Angular の HttpClient がエラー扱いにしないよう JSON を返す
    res.json({
      result: 'Login',
      userId: userId
    });
  },
  
  /**
   * ログアウト
   * 
   * @param req リクエスト
   * @param res レスポンス
   */
  logout: (req, res) => {
    const userId = req.user;
    console.log('Logout', userId);
    
    req.logout();
    res.json({
      result: 'Logout',
      userId: userId
    });
  }
};
