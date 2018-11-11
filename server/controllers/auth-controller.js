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
    const userInfo = req.user;
    
    // Angular の HttpClient がエラー扱いにしないよう JSON を返す
    res.json({
      result  : 'Login',
      id      : userInfo.id,
      userName: userInfo.userName
    });
  },
  
  /**
   * ログアウト
   * 
   * @param req リクエスト
   * @param res レスポンス
   */
  logout: (req, res) => {
    const userInfo = req.user || {};
    
    req.logout();
    res.json({
      result  : 'Logout',
      id      : userInfo.id,
      userName: userInfo.userName
    });
  }
};
