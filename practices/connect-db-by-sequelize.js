const Sequelize = require('sequelize');

// 設定をロードする
require('dotenv').config();

// 接続先 URL
const connectionString = process.env.DATABASE_URL;

console.log('接続開始', connectionString);
const sequelize = new Sequelize(connectionString);

// モデル定義
const TestTableModel = sequelize.define('TestTable', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  name: Sequelize.TEXT
}, {
  // define() の第1引数の文字列をそのままテーブル名として使用する
  // freezeTableName: true,
  // define() の第1引数を別名 (AS) にし、実際のテーブル名を記す
  tableName: 'test_table',
  // createdAt・updatedAt カラムはないので無効化
  createdAt: false,
  updatedAt: false
});

// 検索してみる
TestTableModel.findAll()
  .then((rows) => {
    console.log('Success');
    rows.forEach((row, index) => {
      console.log(index + 1, row.dataValues);
    })
  })
  .catch((error) => {
    console.log('Error', error);
  })
  .then(() => {
    console.log('切断');
    sequelize.close();
  });
