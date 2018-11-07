const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');

// サーバをインスタンス化する
const app = express();

// DB を準備する
// const db = require('./app/db/db');
// db.init();


// ====================================================================================================
// 全体に適用するモノ
// ====================================================================================================

// クッキー設定
app.use(cookieParser());

// セッション設定
app.use(session({
  secret: 'Passport Test',  // クッキーの暗号化に使用するキー
  resave: false,  // セッションチェックする領域にリクエストするたびにセッションを作り直してしまうので false
  saveUninitialized: false,  // 未認証時のセッションを保存しないようにする
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,  // 1 week : クッキーの有効期限をミリ秒指定
    secure: false  // HTTP 利用時は false
  }
}));

// Passport 初期化
app.use(passport.initialize());

// セッション有効化
app.use(passport.session());

// POST されたデータを受け取るための設定を行う
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS を許可する
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});


// ====================================================================================================
// Angular アプリを提供する
// ====================================================================================================

// 以下の設定だけで index.html も返せている様子
app.use(express.static(`${__dirname}/../dist`));

// ルートへのアクセス時は念のため index.html を返すようにしておく
app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../dist/index.html`));
});


// ====================================================================================================
// API を定義する
// ====================================================================================================

// TODO : ルートではアプリを提供したい
// const restApiRoot = '/api';
// app.use(restApiRoot, require('./app/routes/router'));

// '/api' の Router はメソッドチェーンを使ってみた・'/api/examples' の Router は即時関数で返してみた・どちらも動きは同じ
app.use('/api', express.Router()
  .use((req, res, next) => {
    console.log(`${req.url} [${req.method}] : ${JSON.stringify(req.body)}`);
    next();
  })
  .use('/examples', (() => {
    const examplesRouter = express.Router();
    examplesRouter.get('/', (req, res) => {
      res.send('Examples GET API');
    });
    return examplesRouter;
  })())
)
  .get('/api/test', (req, res) => {
    // app.use('/api') で絞っているところからチェーンして .get('/test') と書いてもダメで、'localhost:8080/api/test/' にアクセスさせるには '/api/test' と指定する必要がある
    res.send('Test API');
  });

// 認証試す


// 認証ロジック
passport.use('local', new LocalStrategy({
    usernameField: 'userId',  // POST の body で参照すべきフィールド名を指定できる
    passwordField: 'password',
    session: true,
    passReqToCallback: true
  }, (req, userId, password, done) => {
    console.log('認証ロジック開始', { userId, password });
    if(userId === 'Neos21') {
      req.session.user = userId; console.log(req.session);
      return done(null, userId);  // 成功・第2引数で渡す内容がシリアライズされる
    }
    else {
      return done(null, false);  // 失敗
    }
  })
);

passport.serializeUser((user, done) => {
  console.log('Serialize : ', user);
  done(null, user);
});
passport.deserializeUser((user, done) => {
  console.log('Deserialize : ', user);
  done(null, user);
});



app.post('/login', passport.authenticate('local', {
  session: true
}), (req, res) => {
  console.log('Login OK!', req.user);
  res.json({ result: 'Login!' });  // Angular の HttpClient がエラー扱いにしないよう JSON を返す
});

app.get('/logout', (req, res) => {
  req.logout();
  res.json({ result: 'Logout!' });
});

const isAuthenticated = (req, res, next) => {
  console.log(req.user, req.session);
  console.log(res.locals);
  if(req.session.user) {  // req.isAuthenticated()
    console.log('認証チェック OK');
    return next();
  }
  else {
    console.log('認証チェック NG');
    res.send('isLogined NG!');
  }
}

// ココで isAuthenticated を使いたかったが、セッションを特定する情報をクライアントから送れていないようで上手くいかなかった
app.get('/member-only', passport.authenticate('local'), (req, res) => {
  console.log('メンバオンリー', { userInfo: req.user, content: `Member Only!` })
  res.json({ userInfo: req.user, content: `Member Only!` });
});

/* 認証周り参考
http://kikuchy.hatenablog.com/entry/2013/07/03/042221
https://garafu.blogspot.com/2017/02/express-passport-authn-authz.html
https://qiita.com/papi_tokei/items/9b852774114ebc7a6255
  connect.sid
https://qiita.com/tinymouse/items/fa910bf80a038c7f9ccb
https://qiita.com/moomooya/items/00f89e425a3034b8ea14
  セッション周り

http://knimon-software.github.io/www.passportjs.org/guide/username-password/
http://knimon-software.github.io/www.passportjs.org/guide/configure/

https://github.com/didinj/mean-angular5-passport-authentication/blob/master/routes/api.js
https://github.com/didinj/mean-angular5-passport-authentication/blob/master/src/app/login/login.component.ts#L25-L27
https://github.com/didinj/mean-angular5-passport-authentication/blob/master/src/app/book/book.component.ts#L21
  API 叩くたびに認証する方式 : ログイン時にトークンを払い出している

https://blog.kazu69.net/2017/03/23/http-request-using-cors/
  CORS ポリシーエラーのところ

https://gist.github.com/kikuchy/5912004
 */

// ====================================================================================================
// サーバ起動
// ====================================================================================================

const server = app.listen(process.env.PORT || 8080, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Neo's Matebu : Listening at http://${host}:${port}`);
});
