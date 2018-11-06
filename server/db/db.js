const pg = require('pg');

// DB 接続情報
// TODO : process.env を拾う
const config = require('config');
// "db": {
//   "postgres": {
//     "host"    : "ホスト",
//     "user"    : "ユーザ名",
//     "password": "パスワード",
//     "port"    : ポート番号,
//     "database": "データベース名"
//   }
// }

const pool = new pg.Pool(config.db.postgres);

/** DB ファイルを生成 or 取得する */
const db = new sqliite3.Database('./app/db/sqlite3-database.db');

/** DB の初期化処理 */
const init = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS example (
      id    INTEGER  PRIMARY KEY  AUTOINCREMENT,
      name  TEXT,
      age   INTEGER
    )
  `);
};

module.exports = {
  db: db,
  init: init
};
