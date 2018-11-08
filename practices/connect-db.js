const pg = require('pg');

// 設定をロードする
require('dotenv').config();

// 接続先 URL
const connectionString = process.env.DATABASE_URL; // || 'postgres://postgres:postgres@localhost:5432/my_local_db';

console.log(`接続開始 : ${connectionString}`);
const pool = new pg.Pool({
  connectionString: connectionString
});

pool.query('SELECT * FROM test_table')
  .then((result) => {
    console.log('Success', result);
    if(result.rows) {
      result.rows.forEach((row, index) => {
        console.log(index + 1, row);
      });
    }
  })
  .catch((error) => {
    console.log('Failure', error);
  })
  .then(() => {
    console.log('切断');
    pool.end();
  });

// ▼ UPDATE
// pool.query({
//   text: 'UPDATE test_table SET name = $1 WHERE id = $2',
//   values: ['ローカルテスト2', 2]
// })
//    .then((result) => {
//      console.log('Success', result);
//      if(result.rows) {
//        result.rows.forEach((row, index) => {
//          console.log(index + 1, row);
//        });
//      }
//    })
//    .catch((error) => {
//      console.log('Failure', error);
//    })
//    .then(() => {
//      console.log('切断');
//      pool.end();
//    });

// ▼ SELECT コールバック形式
// pool.query('SELECT * FROM test_table', (error, result) => {
//   console.log({ error, result });
//   if(result.rows) {
//     result.rows.forEach((row, index) => {
//       console.log(index + 1, row);
//     });
//   }
//   pool.end();
// });

// https://node-postgres.com/features/connecting
