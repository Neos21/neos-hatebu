const Sequelize = require('sequelize');

// 環境変数をロードする
require('dotenv').config();

/**
 * Sequelize と生成したモデルを返却する
 */
const Model = {};

// DB 接続する
const connectionString = process.env.DATABASE_URL;
console.log('接続開始', connectionString);
const sequelize = new Sequelize(connectionString);

// 各モデルを定義・格納する
Model.User     = require('./user-model')(sequelize);
Model.Category = require('./category-model')(sequelize);
Model.Entry    = require('./entry-model')(sequelize);

// 各モデルが associate() 関数を定義していれば実行し、関係を定義する
Object.keys(Model).forEach((key) => {
  const model = Model[key];
  if(model.associate) {
    console.log('関係定義実行', key);
    model.associate(Model);
  }
});

// Sequelize を格納する
Model.Sequelize = Sequelize;
Model.sequelize = sequelize;

module.exports = Model;
