const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Model = require('../models/model');

/**
 * Passport の認証・シリアライズ処理を行う関数を返す
 */
module.exports = () => {
  // 認証ロジック
  passport.use('local', new LocalStrategy({
    usernameField: 'userName',  // POST の body から参照するフィールド名を指定する
    passwordField: 'password',
    session: true,
    passReqToCallback: true
  }, (_req, userName, password, done) => {
    console.log('認証処理 : 開始', userName);
    
    // DB 接続してユーザ ID とパスワード (ハッシュ文字列) が一致するデータを取得する
    Model.User.findOne({
      where: {
        userName: userName,
        password: password
      }
    })
      .then((result) => {
        if(result && result.dataValues) {
          console.log('認証処理 : 成功', userName, result.dataValues);
          const userInfo = {
            id: result.dataValues.id,
            userName: result.dataValues.userName
          };
          return done(null, userInfo);  // 成功・第2引数で渡す内容がシリアライズされる
        }
        else {
          console.log('認証処理 : 失敗', { userName, password });
          return done(null, false);  // 失敗
        }
      })
      .catch((error) => {
        console.log('認証処理 : 通信に失敗', { userName, password }, error);
        return done(null, false);  // 失敗
      });
  }));
  
  // シリアライズ
  passport.serializeUser((userInfo, done) => {
    console.log('シリアライズ', userInfo);
    done(null, userInfo);
  });
  
  // デシリアライズ
  passport.deserializeUser((userInfo, done) => {
    console.log('デシリアライズ', userInfo);
    done(null, userInfo);
  });
};
