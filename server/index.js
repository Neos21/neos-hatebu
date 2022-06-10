const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');

/**
 * Neo's Hatebu Server
 */

// サーバをインスタンス化する
const app = express();

// DB・モデル準備
require('./models/model');


// 全体設定
// ====================================================================================================

// クッキー設定
app.use(cookieParser());

// セッション設定
app.use(session({
  secret: 'SessionKey',  // クッキーの暗号化に使用するキー
  resave: false,  // セッションチェックする領域にリクエストするたびにセッションを作り直してしまうので false
  saveUninitialized: false,  // 未認証時のセッションを保存しないようにする
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,  // クッキーの有効期限をミリ秒指定 (1週間)
    secure: false  // HTTP 利用時は false にする・Heroku 環境でも true にするとうまくセッション管理できなかったので false のままにする
  }
}));

// Passport 初期設定
app.use(passport.initialize());
app.use(passport.session());

// POST データを受け取るための設定を行う
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// CORS を許可する
app.use((req, res, next) => {
  const host = req.headers.host;
  if(['localhost:4200', 'localhost:8080'].includes(host)) {
    console.log('CORS : Allow List', { host, headers: req.headers });
    res.header('Access-Control-Allow-Origin', `http://${host}`);
  }
  else {
    console.log('CORS : Default', { headers: req.headers });
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');  // 'http://localhost:8080'
  }
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});


// Passport 認証処理の定義
require('./routes/func-init-passport')();

// ルーティング定義
app.use('/', require('./routes/router'));

// サーバ起動
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Neo's Hatebu : ${port}`);
});
