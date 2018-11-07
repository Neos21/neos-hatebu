const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

// サーバをインスタンス化する
const app = express();

// DB を準備する
// const db = require('./app/db/db');
// db.init();


// ====================================================================================================
// 全体に適用するモノ
// ====================================================================================================

// CORS を許可する
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// POST されたデータを受け取るための設定を行う
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


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


// ====================================================================================================
// サーバ起動
// ====================================================================================================

const server = app.listen(process.env.PORT || 8080, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Neo's Matebu : Listening at http://${host}:${port}`);
});
