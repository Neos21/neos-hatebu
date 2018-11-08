/**
 * 遷移時に認証チェックを行う関数を返す
 * (既に認証済みのユーザからのリクエストかどうかをチェックする)
 * 
 * @param req リクエスト
 * @param res レスポンス
 * @param next 制御関数
 */
module.exports = (req, res, next) => {
  console.log('isAuthenticated : 開始');
  if(req.isAuthenticated()) {
    console.log('isAuthenticated : OK');
    next();
  }
  else {
    console.log('isAuthenticated : NG');
    // HttpClient で catch() に移動させるため 401 を返す
    res.status(401);
    // catch() の仮引数 error 内の error プロパティで以下のオブジェクトが参照できる
    res.send({
      error: 'isAuthenticated : NG'
    });
  }
};
