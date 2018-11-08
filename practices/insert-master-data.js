const pg = require('pg');

// 設定をロードする
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
console.log(`接続開始 : ${connectionString}`);
const pool = new pg.Pool({
  connectionString: connectionString
});

// ターミナルで SQL 動かそうとすると日本語が化けて登録できないのでこのスクリプトで登録した…
Promise.resolve()
  .then(() => {
    console.log(`管理ユーザ登録 : ${process.env.CLIENT_ADMIN_PASSWORD}`);
    return pool.query(`INSERT INTO users ( id, user_id, password ) VALUES ( 1, 'Neos21', '${process.env.CLIENT_ADMIN_PASSWORD}' )`);
  })
  .then ((r) => { console.log('成功', r); })
  .catch((e) => { console.log('失敗', e); })
  .then(() => {
    console.log('カテゴリマスタ登録');
    return pool.query(`
      INSERT INTO categories ( id, name, rss_url, page_url, updated_at ) VALUES
        (  1, '総合 - 人気'          , 'http://b.hatena.ne.jp/hotentry.rss'               , 'http://b.hatena.ne.jp/hotentry/all'           , current_timestamp ),
        (  2, '総合 - 新着'          , 'http://b.hatena.ne.jp/entrylist.rss'              , 'http://b.hatena.ne.jp/entrylist/all'          , current_timestamp ),
        (  3, '一般 - 人気'          , 'http://b.hatena.ne.jp/hotentry/general.rss'       , 'http://b.hatena.ne.jp/hotentry/general'       , current_timestamp ),
        (  4, '一般 - 新着'          , 'http://b.hatena.ne.jp/entrylist/general.rss'      , 'http://b.hatena.ne.jp/entrylist/general'      , current_timestamp ),
        (  5, '世の中 - 人気'        , 'http://b.hatena.ne.jp/hotentry/social.rss'        , 'http://b.hatena.ne.jp/hotentry/social'        , current_timestamp ),
        (  6, '世の中 - 新着'        , 'http://b.hatena.ne.jp/entrylist/social.rss'       , 'http://b.hatena.ne.jp/entrylist/social'       , current_timestamp ),
        (  7, '政治と経済 - 人気'    , 'http://b.hatena.ne.jp/hotentry/economics.rss'     , 'http://b.hatena.ne.jp/hotentry/economics'     , current_timestamp ),
        (  8, '政治と経済 - 新着'    , 'http://b.hatena.ne.jp/entrylist/economics.rss'    , 'http://b.hatena.ne.jp/entrylist/economics'    , current_timestamp ),
        (  9, '暮らし - 人気'        , 'http://b.hatena.ne.jp/hotentry/life.rss'          , 'http://b.hatena.ne.jp/hotentry/life'          , current_timestamp ),
        ( 10, '暮らし - 新着'        , 'http://b.hatena.ne.jp/entrylist/life.rss'         , 'http://b.hatena.ne.jp/entrylist/life'         , current_timestamp ),
        ( 11, '学び - 人気'          , 'http://b.hatena.ne.jp/hotentry/knowledge.rss'     , 'http://b.hatena.ne.jp/hotentry/knowledge'     , current_timestamp ),
        ( 12, '学び - 新着'          , 'http://b.hatena.ne.jp/entrylist/knowledge.rss'    , 'http://b.hatena.ne.jp/entrylist/knowledge'    , current_timestamp ),
        ( 13, 'テクノロジー - 人気'  , 'http://b.hatena.ne.jp/hotentry/it.rss'            , 'http://b.hatena.ne.jp/hotentry/it'            , current_timestamp ),
        ( 14, 'テクノロジー - 新着'  , 'http://b.hatena.ne.jp/entrylist/it.rss'           , 'http://b.hatena.ne.jp/entrylist/it'           , current_timestamp ),
        ( 15, 'おもしろ - 人気'      , 'http://b.hatena.ne.jp/hotentry/fun.rss'           , 'http://b.hatena.ne.jp/hotentry/fun'           , current_timestamp ),
        ( 16, 'おもしろ - 新着'      , 'http://b.hatena.ne.jp/entrylist/fun.rss'          , 'http://b.hatena.ne.jp/entrylist/fun'          , current_timestamp ),
        ( 17, 'エンタメ - 人気'      , 'http://b.hatena.ne.jp/hotentry/entertainment.rss' , 'http://b.hatena.ne.jp/hotentry/entertainment' , current_timestamp ),
        ( 18, 'エンタメ - 新着'      , 'http://b.hatena.ne.jp/entrylist/entertainment.rss', 'http://b.hatena.ne.jp/entrylist/entertainment', current_timestamp ),
        ( 19, 'アニメとゲーム - 人気', 'http://b.hatena.ne.jp/hotentry/game.rss'          , 'http://b.hatena.ne.jp/hotentry/game'          , current_timestamp ),
        ( 20, 'アニメとゲーム - 新着', 'http://b.hatena.ne.jp/entrylist/game.rss'         , 'http://b.hatena.ne.jp/entrylist/game'         , current_timestamp )
    `);
  })
  .then ((r) => { console.log('成功', r); })
  .catch((e) => { console.log('失敗', e); })
  .then (()  => {
    console.log('切断');
    return pool.end();
  });
