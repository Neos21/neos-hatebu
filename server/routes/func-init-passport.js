const LocalStrategy = require('passport-local').Strategy;

/**
 * Passport の認証・シリアライズ処理を行う関数を返す
 * 
 * @param passport Passport オブジェクト
 */
module.exports = (passport) => {
  // 認証ロジック
  passport.use('local', new LocalStrategy({
    usernameField: 'userId',  // POST の body から参照するフィールド名を指定する
    passwordField: 'password',
    session: true,
    passReqToCallback: true
  }, (_req, userId, password, done) => {
    console.log('認証処理 開始', userId);
    
    // TODO : DB 接続して認証する処理を実装する
    if(userId === 'Neos21') {
      console.log('認証処理 : OK', userId)
      return done(null, userId);  // 成功・第2引数で渡す内容がシリアライズされる
    }
    else {
      console.log('認証処理 : NG', { userId, password });
      return done(null, false);  // 失敗
    }
  }));
  
  // シリアライズ
  passport.serializeUser((user, done) => {
    console.log('シリアライズ', user);
    done(null, user);
  });
  
  // デシリアライズ
  passport.deserializeUser((user, done) => {
    console.log('デシリアライズ', user);
    done(null, user);
  });
};
