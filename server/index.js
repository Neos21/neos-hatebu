const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// サーバをインスタンス化する
const app = express();


// ====================================================================================================
// DB・モデル準備
// ====================================================================================================

require('./models/model');


// ====================================================================================================
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
    secure: false  // HTTP 利用時は false にする
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
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});


// ====================================================================================================
// Passport 認証処理の定義
// ====================================================================================================

require('./routes/func-init-passport')();


// ====================================================================================================
// ルーティング定義
// ====================================================================================================

app.use('/', require('./routes/router'));


// ====================================================================================================
// サーバ起動
// ====================================================================================================

const server = app.listen(process.env.PORT || 8080, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Neo's Hatebu : Listening at http://${host}:${port}`);
});
