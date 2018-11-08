const Sequelize = require('sequelize');

// 環境変数をロードする
require('dotenv').config();

// Sequelize と生成したモデルを返却するオブジェクト
const Model = {};

// DB 接続する
const connectionString = process.env.DATABASE_URL;
console.log('接続開始', connectionString);
const sequelize = new Sequelize(connectionString);

// 各モデルを定義・格納する
Model.User = require('./user-model')(sequelize);

// Sequelize を格納する
Model.Sequelize = Sequelize;
Model.sequelize = sequelize;

module.exports = Model;
