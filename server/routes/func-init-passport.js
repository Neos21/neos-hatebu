const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Model = require('../models/model');

/**
 * Passport の認証・シリアライズ処理を行う関数を返す
 */
module.exports = () => {
  // 認証ロジック
  passport.use('local', new LocalStrategy({
    usernameField: 'userId',  // POST の body から参照するフィールド名を指定する
    passwordField: 'password',
    session: true,
    passReqToCallback: true
  }, (_req, userId, password, done) => {
    console.log('認証処理 : 開始', userId);
    
    // DB 接続してユーザ ID とパスワード (ハッシュ文字列) が一致するデータを取得する
    Model.User.findOne({
      where: {
        userId  : userId,
        password: password
      }
    })
      .then((result) => {
        if(result && result.dataValues) {
          console.log('認証処理 : 成功', userId);
          return done(null, userId);  // 成功・第2引数で渡す内容がシリアライズされる
        }
        else {
          console.log('認証処理 : 失敗', { userId, password });
          return done(null, false);  // 失敗
        }
      })
      .catch((error) => {
        console.log('認証処理 : 通信に失敗', { userId, password }, error);
        return done(null, false);  // 失敗
      });
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
